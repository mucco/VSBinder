import * as vscode from "vscode";

import { state, getCampaignPath, setCurrentAdventure } from "./state";

let fs = require("fs");

export function selectLastAdventure()
{
    if (state.currentCampaign === "") {
        console.log('Selecting last adventure but no campaign');
        vscode.window.showInformationMessage('Please create a campaign first!');
        return;
    }

    vscode.workspace.findFiles(new vscode.RelativePattern(getCampaignPath(), "Adventures/*.md")).then(adventures => {
        let maxId = 1;
        let adventure = "";
        adventures.forEach(adv => {
            let adventureName = adv.path.split('/').pop() ?? "";
            let id = adventureName.slice(0, 2);
            if (id) {
                let oldId = maxId;
                maxId = Math.max(maxId, +id + 1);
                if (oldId !== maxId)
                {
                    adventure = adventureName;
                }
            }
        });

        if (adventure !== "")
        {
            setCurrentAdventure(adventure);
        }
        else
        {
            console.log("No adventure found");
            vscode.window.showInformationMessage("No adventure found in the campaign.");
        }
    });
}

export function createAdventure(prompt: string = "What is the name of the adventure?") {
    if (state.currentCampaign === "") {
        console.log('Creating adventure but no campaign');
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
            vscode.workspace.openTextDocument(state.templates.adventure).then((source) => {
                fs.writeFileSync(vscode.Uri.file(name).fsPath, source.getText());
                vscode.workspace.openTextDocument(vscode.Uri.file(name)).then((dest) => {
                    vscode.window.showTextDocument(dest);
                });
            });
            vscode.workspace.applyEdit(wsedit).then((success) => {
                    if (!success) {
                        vscode.window.showInformationMessage("Create adventure " + name + " result " + success);
                }
            });
            setCurrentAdventure(name);
        });
    });
}

export function changeAdventure() {
    vscode.workspace.findFiles(new vscode.RelativePattern(getCampaignPath(), "Adventures/*.md")).then(adventures => {
        if (adventures.length === 0) {
            return;
        }

        let selections: string[] = [];
        for (let i = 0; i < adventures.length; i++) {
            let pathParts = adventures[i].path.split('/');
            let campaignName = pathParts.pop() ?? "";
            selections.push(campaignName);
        }

        let options: vscode.QuickPickOptions = {
            canPickMany: false,
        };
        vscode.window.showQuickPick(selections, options).then((selected) => {
            selected = selected ?? "";
            for (let i = 0; i < selections.length; i++) {
                if (selections[i] === selected)
                {
                    setCurrentAdventure(selected);
                }
            }
        });
    });
}
