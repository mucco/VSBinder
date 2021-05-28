import * as vscode from "vscode";

import { state, getCampaignPath } from "./state";

let fs = require("fs");

export function createAdventure(prompt: string = "What is the name of the adventure?") {
    if (state.currentCampaign === "") {
        console.log('Please create a campaign first!');
        vscode.window.showInformationMessage('Please create a campaign first!');
        return;
    }

    let options: vscode.InputBoxOptions = {
        prompt: prompt,
    };

    vscode.workspace.findFiles(new vscode.RelativePattern(getCampaignPath(), "Adventures/*.md")).then(adventures => {
        let maxId = 1;
        adventures.forEach(adv => {
            let id = adv.path.split('/').pop()?.slice(0, 2);
            if (id) {
                maxId = Math.max(maxId, +id + 1);
            }
        });
        let maxIdString = (maxId > 9 ? "" : "0") + maxId;

        vscode.window.showInputBox(options).then(adventure => {
            if (!adventure) {
                return;
            }
            let name = getCampaignPath() + "/Adventures/" + maxIdString + " " + adventure + ".md";
            let wsedit = new vscode.WorkspaceEdit();
            wsedit.createFile(vscode.Uri.file(name));

            if (!vscode.workspace.workspaceFolders) {
                return;
            }
            vscode.workspace.openTextDocument(vscode.Uri.joinPath(vscode.workspace.workspaceFolders[0].uri, "templates/Adventure.md")).then((source) => {
                fs.writeFileSync(vscode.Uri.file(name).fsPath, source.getText());
                vscode.workspace.openTextDocument(vscode.Uri.file(name)).then((dest) => {
                    vscode.window.showTextDocument(dest);
                });
            });
            state.currentAdventure = name;
            vscode.workspace.applyEdit(wsedit).then((success) => {
                if (!success) {
                    vscode.window.showInformationMessage("Create adventure " + name + " result " + success);
                }
            });
        });
    });
}
