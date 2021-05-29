import * as vscode from "vscode";

import { state, getCampaignPath } from "./state";
import { createAdventure } from "./adventure";

let fs = require("fs");

export function createCampaign() {
    if (state.currentWorld === "") {
        console.log('Please create a world first!');
        vscode.window.showInformationMessage('Please create a world first!');
        return;
    }

    let options: vscode.InputBoxOptions = {
        prompt: "What is the name of the campaign?",
    };
    vscode.window.showInputBox(options).then(campaign => {
        if (!campaign) {
            return;
        }
        state.currentCampaign = campaign;
        let wsedit = new vscode.WorkspaceEdit();
        let name = getCampaignPath() + "/Campaign.md";
        wsedit.createFile(vscode.Uri.file(name));

        wsedit.createFile(vscode.Uri.file(getCampaignPath() + "/Characters/Sample Character.md"));
        vscode.workspace.applyEdit(wsedit).then((success) => {
            vscode.window.showInformationMessage("Create campaign " + campaign + " result " + success);

            if (vscode.workspace.workspaceFolders) {
                vscode.workspace.openTextDocument(state.templates.campaign).then((source) => {
                    fs.writeFileSync(vscode.Uri.file(name).fsPath, source.getText());
                    vscode.workspace.openTextDocument(vscode.Uri.file(name));
                });
            }
        });

        createAdventure("What is the name of the first adventure?");
    });
}

export function setActiveCampaign() {
    vscode.workspace.findFiles(new vscode.RelativePattern(state.wsPath, "**/Campaign.md")).then(campaigns => {
        if (campaigns.length === 0) {
            return;
        }
        let splitPath = campaigns[0].path.split('/');
        splitPath.pop(); // discard 'Campaign.md'
        state.currentCampaign = splitPath.pop() ?? ""; // retrieve campaign folder name
        console.log("Set active campaign to " + state.currentCampaign);
        splitPath.pop(); // discard 'Campaigns'
        state.currentWorld = splitPath.pop() ?? ""; // retrieve world folder name
        console.log("Set active world to " + state.currentWorld);
    });
}
