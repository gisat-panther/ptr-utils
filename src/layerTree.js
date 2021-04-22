import {isArray as _isArray, isObject as _isObject} from 'lodash';

/**
 *
 * @param {Array<Object>} layersTreeState
 * @param {string} folderKey
 * @returns {Object}
 */
const getFolderByKey = (layersTreeState = [], folderKey) => {
	for (const item of layersTreeState) {
		if (item && item.type === 'folder' && item.key === folderKey) {
			return item;
		}

		if (item.type === 'folder') {
			const foundFolder = getFolderByKey(item.items, folderKey);
			if (foundFolder) {
				return foundFolder;
			}
		}
	}
};

/**
 *
 * @param {Array<Object> | Object} layersTree
 * @param {string} layerKey
 * @returns {Object|null}
 */
const getFolderByLayerKey = (layersTree, layerKey) => {
	if (_isArray(layersTree)) {
		for (const item of layersTree) {
			const folder = getFolderByLayerKey(item, layerKey);
			if (folder) {
				return folder;
			}
		}
	}

	if (_isObject(layersTree)) {
		//check if some child layer has same key
		if (layersTree && layersTree.type === 'folder') {
			const containsLayer = layersTree.items.some(
				item => item.key === layerKey
			);
			if (containsLayer) {
				return layersTree;
			}

			for (const item of layersTree.items) {
				if (item.type === 'folder') {
					const foundFolder = getFolderByLayerKey(item, layerKey);
					if (foundFolder) {
						return foundFolder;
					}
				}
			}
		} else {
			return null;
		}
	}
};

const getFlattenLayerTree = (layersTree = {}) => {
	const layerTreeKeys = Object.entries(layersTree);
	const flattenLayers = layerTreeKeys.reduce((acc, val) => {
		const [key, tree] = val;
		const flattenLayers = getFlattenLayers(tree);
		return [...acc, ...flattenLayers];
	}, []);

	return flattenLayers;
};

/**
 * Return ordered layers from given layerTree from bottom to top.
 * @param {*} layersTree
 * @returns {Array}
 */
const getFlattenLayers = (layersTree = []) => {
	const flatLayers = branch =>
		branch.reduce((acc, item) => {
			switch (item.type) {
				case 'folder':
					return [...acc, ...flatLayers(item.items)];
				case 'layerTemplate':
					return [...acc, item];
				default:
					return acc;
			}
		}, []);

	return [...flatLayers(layersTree).reverse()];
};

/**
 * Get z-index for layer from layerTree
 * @param {*} layersTree
 * @param {*} layerTemplateKey
 * @returns {Number|null}
 */
const getLayerZindex = (layersTree, layerTemplateKey) => {
	const flattenLayers = getFlattenLayerTree(layersTree);
	const zIndex = flattenLayers.findIndex(l => l.key === layerTemplateKey);

	return zIndex === -1 ? null : zIndex;
};

/**
 * Iterate over all tree leaf that are not folder
 * @param {Object} tree
 * @param {function} callback
 */
const forAllTreeItems = (layerTree = [], callback) => {
	return layerTree.reduce((accumulator, item) => {
		if (item.type === 'folder') {
			return forAllTreeItems(item.items, callback);
		} else {
			const transformed = callback(item);
			if (transformed) {
				return [...accumulator, transformed];
			} else {
				return accumulator;
			}
		}
	}, []);
};

export default {
	forAllTreeItems,
	getFlattenLayers,
	getFlattenLayerTree,
	getFolderByKey,
	getFolderByLayerKey,
	getLayerZindex,
};
