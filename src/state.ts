import * as vscode from "vscode";

let state = {
    wsPath: "",
    templates: {
        adventure: "",
        campaign: "",
    },
    currentWorld: "",
    currentCampaign: "",
    currentAdventure: "",
};

export { state };

export function getWorldPath() {
	return state.wsPath + "/" + state.currentWorld;
}

export function getCampaignPath() {
	return getWorldPath() + "/Campaigns/" + state.currentCampaign;
}

export function setCurrentCampaign(name: string)
{
    state.currentCampaign = name;
    vscode.window.showInformationMessage("Campaign \"" + name + "\" now active.");
    console.log("Set active campaign to " + state.currentCampaign);
}

export function setCurrentAdventure(name: string)
{
    state.currentAdventure = name;
    vscode.window.showInformationMessage("Adventure \"" + name + "\" now active.");
}
