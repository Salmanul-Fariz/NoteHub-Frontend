import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WorkspaceTreeService {
  #OrderArray: any[] = [];
  root: any[] = [];

  #_printAllNodes(root: any, level: string) {
    for (const data of root) {
      const dataObj = {
        level: level,
        _id: data._id,
        type: data.type,
        content: data.content,
      };
      this.#OrderArray.push(dataObj);
      if (data.childNode.length > 0) {
        const percentage: number = Number(level.split('%')[0]);
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
