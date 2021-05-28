// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import { state, getWorldPath, getCampaignPath } from "./state";
import { createAdventure } from "./adventure";

function createWorld() {
	let options: vscode.InputBoxOptions = {
		prompt: "What is the name of the world or setting?",
	};
	vscode.window.showInputBox(options).then(world => {
		if (!world) {
			return;
		}
		state.currentWorld = world;
		let wsedit = new vscode.WorkspaceEdit();
		wsedit.createFile(vscode.Uri.file(getWorldPath() + "/" + world + ".md"));
		wsedit.createFile(vscode.Uri.file(getWorldPath() + "/Locations/Sample location.md"));
		wsedit.createFile(vscode.Uri.file(getWorldPath() + "/Bestiary/Sample monster.md"));
		vscode.workspace.applyEdit(wsedit).then((success) => {
			vscode.window.showInformationMessage("Create world " + world + " result " + success);
		});
	}).then(() => {
		createCampaign();
	});
}

function createCampaign() {
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
		wsedit.createFile(vscode.Uri.file(getCampaignPath() + "/Campaign.md"));
		wsedit.createFile(vscode.Uri.file(getCampaignPath() + "/Characters/Sample Character.md"));
		vscode.workspace.applyEdit(wsedit).then((success) => {
			vscode.window.showInformationMessage("Create campaign " + campaign + " result " + success);
		});

		createAdventure("What is the name of the first adventure?");
	});
}

function setActiveCampaign() {
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

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "VSBinder" is now active!');

	if (!vscode.workspace.workspaceFolders) {
		return;
	}

	state.wsPath = vscode.workspace.workspaceFolders[0].uri.path;
	setActiveCampaign();

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('VSBinder.createWorld', createWorld);
	context.subscriptions.push(disposable);
	disposable = vscode.commands.registerCommand('VSBinder.createCampaign', createCampaign);
	context.subscriptions.push(disposable);
	disposable = vscode.commands.registerCommand('VSBinder.createAdventure', createAdventure);
	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
