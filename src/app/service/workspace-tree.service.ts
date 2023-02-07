import { Injectable } from '@angular/core';

@Injectable()
export class WorkspaceTreeService {
  #OrderArray: any[] = [];
  isToggle: boolean;
  isToggleLevel: number[] = [];
  isToggleOpenLevel: string[] = [];
  root: any[] = [];
  toggleInc: number = 0;

  #_printAllNodes(root: any, level: string, pdfLevel: number) {
    for (const data of root) {
      const dataObj = {
        level: level,
        pdfLevel: pdfLevel,
        toggleInc: this.toggleInc,
        _id: data._id,
        type: data.type,
        imgPosition: data.imgPosition,
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

        this.#_printAllNodes(
          data.childNode,
          `${percentage - 5}%`,
          pdfLevel + 1
        );
      }
    }
  }

  ChangeDatatolevel() {
    const tree = new WorkspaceTreeService();
    tree.#_printAllNodes(this.root, '100%', 0);

    return tree.#OrderArray;
  }
}
