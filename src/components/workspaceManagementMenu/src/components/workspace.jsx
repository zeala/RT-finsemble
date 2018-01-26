/*!
* Copyright 2017 by ChartIQ, Inc.
* All rights reserved.
 * This is a single workspace. When clicked, it requests that the app switch to the clicked workspace.
 */

import React from "react";
import { FinsembleMenuItem, FinsembleMenuItemLabel, FinsembleMenuItemActions } from "@chartiq/finsemble-react-controls";

export default class Workspace extends React.Component {
	constructor(props) {
		super(props);
		this.bindCorrectContext();
	}
	/**
     * This is necessary to make sure that the `this` inside of the callback is correct.
     *
     * @memberof LinkerButton
     */
	bindCorrectContext() {
		this.onClick = this.onClick.bind(this);
	}

	/**
	 * When the main body of the component is clicked, we fire off the mainAction. By default this is to switch workspaces.
	 *
	 * @memberof Workspace
	 */
	onClick() {
		this.props.mainAction({
			name: this.props.workspace.name
		});
	}

	/**
	 * Generates the buttons for the actions that are passed down from the parent. By default, those actions are delete workspace and pin workspace.
	 *
	 * @returns
	 * @memberof Workspace
	 */
	renderButtons() {
		let { workspace, itemActions } = this.props;
		//Remove trashcan for activeWorkspace. Prevents it from being deleted and causing issues.
		if (this.props.isActiveWorkspace) {
			let index = itemActions.findIndex(el => el.iconClass.includes('ff-delete'));
			itemActions.splice(index, 1);
		}
		return itemActions.map(function (action, index) {
			let classes = "menu-item-action";
			let iconClasses = action.iconClass;
			if (workspace.isPinned && iconClasses.includes('pin')) {
				iconClasses += " finsemble-item-pinned";
			} else {
				classes += " remove-workspace";
			}
			let label = action.label || "";
			return (<div key={index} className={classes} onClick={
				() => {
					action.method(workspace);
				}
			}>
				{action.iconClass &&
					<i className={iconClasses}></i>
				}
			</div>);
		});
	}
	/**
	 * Render method.
	 *
	 * @returns
	 * @memberof Workspace
	 */
	render() {
		let actionButtons = null,
			style = {};

		//Actions are remove and pin workspace.
		if (this.props.itemActions) {
			actionButtons = this.renderButtons();
		}

		let classes = this.props.isActiveWorkspace ? "active-workspace workspace-name" : "workspace-name";
		return (
			<FinsembleMenuItem>
				<FinsembleMenuItemLabel label={this.props.workspace.name} className={classes} onClick={this.onClick}/>
				{actionButtons && <FinsembleMenuItemActions>
					{actionButtons}
				</FinsembleMenuItemActions>}
			</FinsembleMenuItem>
		);
	}
}