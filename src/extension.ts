// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import * as path from 'path';

import { state, getWorldPath } from "./state";
import { changeAdventure, createAdventure, selectLastAdventure } from "./adventure";
import { createCampaign, setFirstCampaign, changeCampaign } from "./campaign";

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
	state.templates.adventure = context.asAbsolutePath(path.join("templates", "AdventureTemplate.md"));
	state.templates.campaign = context.asAbsolutePath(path.join("templates", "CampaignTemplate.md"));
	setFirstCampaign().then(() => {
		selectLastAdventure();
	});

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('VSBinder.createWorld', createWorld);
	context.subscriptions.push(disposable);
	disposable = vscode.commands.registerCommand('VSBinder.createCampaign', createCampaign);
	context.subscriptions.push(disposable);
	disposable = vscode.commands.registerCommand('VSBinder.createAdventure', createAdventure);
	context.subscriptions.push(disposable);
	disposable = vscode.commands.registerCommand('VSBinder.changeCampaign', changeCampaign);
	context.subscriptions.push(disposable);
	disposable = vscode.commands.registerCommand('VSBinder.changeAdventure', changeAdventure);
	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
