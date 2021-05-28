// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

const wsedit: vscode.WorkspaceEdit = new vscode.WorkspaceEdit();
let wsPath: string = "";
let currentCampaign: string = "";
let currentAdventure: string = "";

function getCampaignPath() {
	return wsPath + "/" + currentCampaign;
}

function createAdventure(prompt: string = "What is the name of the adventure?") {
	let options: vscode.InputBoxOptions = {
		prompt: prompt,
	};

	vscode.workspace.findFiles(new vscode.RelativePattern(wsPath, "Adventures/*.md")).then(adventures => {
		let maxId = 1;
		adventures.forEach(adv => {
			let id = adv.path.split('/').pop()?.slice(0, 2);
			if (id)
				maxId = Math.max(maxId, +id + 1);
		});

		vscode.window.showInputBox(options).then(adventure => {
			if (!adventure)
				return;
			let name = getCampaignPath() + "/Adventures/" + maxId + " " + adventure + ".md";
			wsedit.createFile(vscode.Uri.file(name));
			currentAdventure = name;
			vscode.workspace.applyEdit(wsedit);
		});
	});
}

function createCampaign() {
	let options: vscode.InputBoxOptions = {
		prompt: "What is the name of the campaign?",
	};
	vscode.window.showInputBox(options).then(campaign => {
		if (!campaign)
			return;
		currentCampaign = campaign;
		wsedit.createFile(vscode.Uri.file(getCampaignPath() + "/Campaign.md"));

		createAdventure("What is the name of the first adventure?");
	});

	vscode.window.showInformationMessage('Hello World from VSBinder!');
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "VSBinder" is now active!');

	if (!vscode.workspace.workspaceFolders)
		return;

	wsPath = vscode.workspace.workspaceFolders[0].uri.path;

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('VSBinder.createCampaign', createCampaign);
	context.subscriptions.push(disposable);
	disposable = vscode.commands.registerCommand('VSBinder.createAdventure', createAdventure);
	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
