let state = {
    wsPath: "",
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
