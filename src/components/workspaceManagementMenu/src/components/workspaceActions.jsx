/*!
* Copyright 2017 by ChartIQ, Inc.
* All rights reserved.
 * This is the list of actions the user can take; it's placed above the list of workspaces..
 */
import React from "react";
import { FinsembleMenuItem, FinsembleMenuItemLabel, FinsembleMenuSection } from "@chartiq/finsemble-react-controls";
import { getStore, Actions as WorkspaceManagementMenuActions } from "../stores/workspaceManagementMenuStore";

export default class WorkspaceActions extends React.Component {
	constructor() {
		super();
		this.userActions = [{
			method: this.createWorkspace,
			label: "New Workspace",
			iconClass: "ff-new-workspace",
			id: "NewWorkspace"
		},
		{
			method: this.saveWorkspace,
			label: "Save",
			iconClass: "ff-save-1",
			id: "SaveWorkspace"
		},
		{
			method: this.saveWorkspaceAs,
			label: "Save As",
			iconClass: "ff-saveas-1",
			id: "SaveWorkspaceAs"
		}];
	}

	/**
	 * Blurs window. Pops up a dialog asking for a name for the new workspace.
	 *
	 * @memberof WorkspaceActions
	 */
	createWorkspace() {
		WorkspaceManagementMenuActions.blurWindow();
		WorkspaceManagementMenuActions.newWorkspace();
	}

	/**
	 * Blurs window. Persists activeWorkspace to the storage.
	 *
	 * @memberof WorkspaceActions
	 */
	saveWorkspace() {
		WorkspaceManagementMenuActions.blurWindow();
		WorkspaceManagementMenuActions.saveWorkspace();
	}

	/**
	 * Blurs window. Pops up a dialog asking for a name for the new workspace.
	 *
	 * @memberof WorkspaceActions
	 */
	saveWorkspaceAs() {
		WorkspaceManagementMenuActions.blurWindow();
		WorkspaceManagementMenuActions.saveWorkspaceAs();
	}

	/**
	 * Render method.
	 *
	 * @returns
	 * @memberof WorkspaceActions
	 */
	render() {
		/**
		 * Iterates through the list of actions defined in the constructor, creating an `li` for each.
		 */
		var workspaceActions = this.userActions.map(function (action, index) {
			return (<FinsembleMenuItem key={index}>
				<FinsembleMenuItemLabel onClick={action.method} className='menu-item-fullwidth workspace-action'>
					<i className={action.iconClass}></i> {action.label}
				</FinsembleMenuItemLabel>
			</FinsembleMenuItem>);
		});
		return (<FinsembleMenuSection  className='menu-secondary workspace-actions'>
			{workspaceActions}
		</FinsembleMenuSection>);
	}
}