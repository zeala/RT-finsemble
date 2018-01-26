/*!
* Copyright 2017 by ChartIQ, Inc.
* All rights reserved.
*/
var chai = require("chai");
var assert = chai.assert;
var should = chai.should;
var expect = chai.expect;
var RouterClient = FSBL.Clients.RouterClient;
var LauncherClient = FSBL.Clients.LauncherClient;
var merge = require("deepmerge");
Array.prototype.diff = function (a) {
	return this.filter(function (i) { return a.indexOf(i) < 0; });
};
function getComponentElement(name) {
	name = name.replace(/\s/g, "").toLowerCase();
	return new Promise(function (resolve, reject) {
		let components = Array.from(document.querySelectorAll(".ComponentList > ul > .menu-item"));
		for (let i = 0; i < components.length; i++) {
			let component = components[i];
			let componentLabel = components[i].getElementsByClassName("menu-item-label")[0];
			if (componentLabel.textContent.replace(/\s/g, "").toLowerCase().includes(name)) {
				return resolve(component);
			}
		}
		reject(new Error("Component Not found"));
	});
}
function spawnComponents() {
	return new Promise(function (resolve, reject) {
		var initiallySpawnedComponents = merge([], appLauncherStore.spawnedComponents);
		try {
			let components = Array.from(document.querySelectorAll(".ComponentList > ul > .menu-item"));
			for (var i = 0; i < components.length; i++) {
				var component = components[i].getElementsByClassName("menu-item-label")[0];
				if (!component.textContent.includes("Test Runner") && !component.textContent.includes("Native")) {
					component.click();
				}
			}
			setTimeout(function () {
				let componentList = appLauncherStore.spawnedComponents.diff(initiallySpawnedComponents);
				resolve({
					componentList: componentList
				});
			}, components.length * 1000);
		} catch (e) {
			reject(e);
		}
	});
}

function unpinAllComponents() {
	return new Promise(function (resolve, reject) {
		var initiallySpawnedComponents = merge([], appLauncherStore.spawnedComponents);
		try {
			let components = Array.from(document.querySelectorAll(".ComponentList > ul > .menu-item"));
			for (var i = 0; i < components.length; i++) {
				var component = components[i].getElementsByClassName("ff-pin")[0];
				if (component.className.includes("pinned")) {
					component.click();
				}
			}
			setTimeout(function () {
				let componentList = appLauncherStore.spawnedComponents.diff(initiallySpawnedComponents);
				resolve({
					numComponents: components.length
				});
			}, 1000);
		} catch (e) {
			reject(e);
		}
	});
}

function pinAllComponents() {
	return new Promise(function (resolve, reject) {
		var initiallySpawnedComponents = merge([], appLauncherStore.spawnedComponents);
		try {
			let components = Array.from(document.querySelectorAll(".ComponentList > ul > .menu-item"));
			for (var i = 0; i < components.length; i++) {
				var component = components[i].getElementsByClassName("ff-pin")[0];
				if (!component.className.includes("pinned")) {
					component.click();
				}
			}
			setTimeout(function () {
				let componentList = appLauncherStore.spawnedComponents.diff(initiallySpawnedComponents);
				resolve(components.length);
			}, 1000);
		} catch (e) {
			reject(e);
		}
	});
}
function checkIfComponentExists(name) {
	name = name.replace(/\s/g, "").toLowerCase();
	return new Promise(function (resolve, reject) {
		let components = Array.from(document.querySelectorAll(".ComponentList > ul > .menu-item"));
		for (var i = 0; i < components.length; i++) {
			var component = components[i].getElementsByClassName("menu-item-label")[0];
			if (component.textContent.replace(/\s/g, "").toLowerCase().includes(name)) {
				return resolve({
					exists: true
				});
			}
		}
		resolve({
			exists: false
		});
	});
}
function spawnComponent (data){
	return new Promise(function (resolve, reject) {
		getComponentElement(data.name)
			.then((el) => {
				return new Promise(function (res, rej) {
					let label = el.querySelector(".menu-item-label");
					label.click();
					res();
				});
			})
			.then(() => {
				setTimeout(resolve, 1200);
			});
	});
}
RouterClient.addResponder("TestRunner.AppLauncherMenu", function (err, message) {
	function sendSuccess(data) {
		message.sendQueryResponse(null, data);
	}
	function sendError(error) {
		message.sendQueryResponse(error, null);
	}
	let data = message.data;

	switch (data.test) {
	case "spawnComponent":
		spawnComponent(data)
				.then(sendSuccess)
				.catch(sendError);
		break;
	case "spawnComponents":
		spawnComponents()
				.then(sendSuccess)
				.catch(sendError);
		break;
	case "pinAllComponents":
		pinAllComponents()
				.then(function (numPinned) {
					sendSuccess({
						numPinned: numPinned
					});
				})
				.catch(sendError);
		break;
	case "unpinAllComponents":
		unpinAllComponents()
				.then(sendSuccess)
				.catch(sendError);
		break;
	case "createAdHoc":
		document.getElementById("Adhoc").click();
		setTimeout(function () {
			sendSuccess();
		}, 2500);
		break;
	case "checkIfComponentExists":
		checkIfComponentExists(data.name)
				.then(sendSuccess)
				.catch(sendError);
		break;
	case "removeAdHoc":
		getComponentElement(data.name)
				.then(function (el) {
					return new Promise(function (resolve, reject) {
						var deleteButton =
							el.querySelector(".menu-item-actions > .ff-delete");
						deleteButton.click();
						setTimeout(resolve, 2500);
					});
				})
				.then(sendSuccess);
		break;
	}
});