import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WorkspaceTreeService {
  #OrderArray: any[] = [];
  isToggle: boolean;
  isToggleLevel: number[] = [];
  isToggleOpenLevel: string[] = [];
  root: any[] = [];
  toggleInc: number = 0;

  // #_toggleOption(array: any) {
  //   // optionToggle.isToggle = !optionToggle.isToggle;

  //   // const percentage: number = Number(
  //   //   this.pagesDetails.levelPage[index].level.split('%')[0]
  //   // );
  //   const parent: number[]=[0];
  //   const
  //   for (let i = 0; i < array.length; i++) {
  //     if(parent[parent.length-1]>array[i].)
  //   }

  //   let elIndex = Number(index);
  //   let stop = false;
  //   while (!stop) {
  //     elIndex++;
  //     const el = this.pagesDetails.levelPage[elIndex];

  //     const curPercent = el?.level.split('%')[0];

  //     if (
  //       percentage === Number(curPercent) ||
  //       percentage < Number(curPercent) ||
  //       this.pagesDetails.levelPage.length === elIndex
  //     ) {
  //       stop = true;
  //     } else {
  //       const div = document.getElementById(`main-${el._id}`) as HTMLElement;
  //       if (openToggle) {
  //         div.style.display = 'block';
  //       } else {
  //         div.style.display = 'none';
  //       }
  //     }
  //     document.body.style.cursor = 'auto';
  //   }
  // }

  #_printAllNodes(root: any, level: string) {
    for (const data of root) {
      const dataObj = {
        level: level,
        toggleInc: this.toggleInc,
        _id: data._id,
        type: data.type,
        content: data.content,
        isToggle: data.isToggle,
        childToggle: '',
      };

      if (this.isToggle) {
        const percentage: number = Number(level.split('%')[0]);
        if (
          percentage === this.isToggleLevel[this.isToggleLevel.length - 1] ||
          percentage > this.isToggleLevel[this.isToggleLevel.length - 1]
        ) {
          this.isToggleLevel.pop();
          this.isToggleOpenLevel.pop();

          if (
            percentage > this.isToggleLevel[0] ||
            percentage === this.isToggleLevel[0]
          ) {
            this.isToggleLevel.length = 0;
            this.isToggleOpenLevel.length = 0;
          }

          if (this.isToggleLevel.length === 0) {
            this.isToggle = false;
            this.toggleInc = 0;
          } else {
            this.toggleInc--;
          }

          dataObj.toggleInc = this.toggleInc;
        }
      }

      if (this.isToggleOpenLevel.length === 0) {
        dataObj.childToggle = 'null';
      } else {
        dataObj.childToggle =
          this.isToggleOpenLevel[this.isToggleOpenLevel.length - 1];
      }

      this.#OrderArray.push(dataObj);
      if (data.childNode.length > 0) {
        const percentage: number = Number(level.split('%')[0]);
        if (data.type === 'toggle') {
          this.isToggleLevel.push(percentage);
          this.isToggle = true;

          this.toggleInc++;
          if (data.isToggle) {
            this.isToggleOpenLevel.push('open');
          } else {
            this.isToggleOpenLevel.push('close');
          }
        }

        this.#_printAllNodes(data.childNode, `${percentage - 5}%`);
      }
    }
  }

  ChangeDatatolevel() {
    const tree = new WorkspaceTreeService();
    tree.#_printAllNodes(this.root, '100%');

    return tree.#OrderArray;
  }
}
