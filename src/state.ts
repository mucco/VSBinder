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
