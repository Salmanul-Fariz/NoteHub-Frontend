import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WorkspaceTreeService {
  #OrderArray: any[] = [];
  isToggle: boolean;
  isToggleLevel: number[] = [];
  root: any[] = [];
  toggleInc: number = 0;

  #_printAllNodes(root: any, level: string) {
    for (const data of root) {
      const dataObj = {
        level: level,
        toggleInc: this.toggleInc,
        _id: data._id,
        type: data.type,
        content: data.content,
      };

      if (this.isToggle) {
        const percentage: number = Number(level.split('%')[0]);
        if (
          percentage === this.isToggleLevel[this.isToggleLevel.length - 1] ||
          percentage > this.isToggleLevel[this.isToggleLevel.length - 1]
        ) {
          if (percentage > this.isToggleLevel[0]) {
            this.isToggleLevel.length = 0;
          }
          this.isToggleLevel.pop();

          if (this.isToggleLevel.length === 0) {
            this.isToggle = false;
            this.toggleInc = 0;
          } else {
            this.toggleInc--;
          }

          dataObj.toggleInc = this.toggleInc;
        }
      }

      this.#OrderArray.push(dataObj);
      if (data.childNode.length > 0) {
        const percentage: number = Number(level.split('%')[0]);
        if (data.type === 'toggle') {
          this.isToggleLevel.push(percentage);

          this.isToggle = true;

          this.toggleInc++;
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
