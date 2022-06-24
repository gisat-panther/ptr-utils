import {describe, it} from 'mocha';
import {assert} from 'chai';
import layerTree from '../src/layerTree';

describe('layerTree', function () {
	describe('getFolderByKey', function () {
		const tests = [
			{
				name: 'empty tree',
				layersTreeState: [],
				folderKey: 'f1',
				expectedFolder: undefined,
			},
			{
				name: 'key first in root',
				layersTreeState: [{type: 'folder', key: 'f1'}],
				folderKey: 'f1',
				expectedFolder: {type: 'folder', key: 'f1'},
			},
			{
				name: 'key second in root',
				layersTreeState: [
					{type: 'folder', key: 'f0'},
					{type: 'folder', key: 'f1'},
				],
				folderKey: 'f1',
				expectedFolder: {type: 'folder', key: 'f1'},
			},
			{
				name: 'key inside another folder',
				layersTreeState: [
					{type: 'folder', key: 'f0'},
					{type: 'folder', key: 'f1'},
				],
				folderKey: 'f1',
				expectedFolder: {type: 'folder', key: 'f1'},
			},
			{
				name: 'key inside another folder',
				layersTreeState: [
					{
						type: 'folder',
						key: 'f0',
						items: [{type: 'folder', key: 'f1'}],
					},
				],
				folderKey: 'f1',
				expectedFolder: {type: 'folder', key: 'f1'},
			},
		];

		tests.forEach(test => {
			it(test.name, function () {
				assert.deepStrictEqual(
					layerTree.getFolderByKey(test.layersTreeState, test.folderKey),
					test.expectedFolder
				);
			});
		});
	});

	describe('getFolderByLayerKey', function () {
		const tests = [
			{
				name: 'empty tree',
				layersTree: [],
				layerKey: 'f1',
				expectedFolder: null,
			},
			{
				name: 'missing key',
				layersTree: {
					type: 'folder',
					items: [{key: 'f1'}],
				},
				layerKey: 'f0',
				expectedFolder: undefined,
			},
			{
				name: 'key in root layer',
				layersTree: {
					type: 'folder',
					items: [{key: 'f1'}],
				},
				layerKey: 'f1',
				expectedFolder: {
					type: 'folder',
					items: [{key: 'f1'}],
				},
			},
			{
				name: 'key inside another layer',
				layersTree: {
					type: 'folder',
					items: [{type: 'folder', key: 'f0', items: [{key: 'f1'}]}],
				},
				layerKey: 'f1',
				expectedFolder: {
					type: 'folder',
					key: 'f0',
					items: [{key: 'f1'}],
				},
			},
			{
				name: 'key from one of the layers',
				layersTree: [
					{
						type: 'folder',
						items: [{key: 'f0'}],
					},
					{
						type: 'folder',
						items: [{key: 'f1'}],
					},
				],
				layerKey: 'f1',
				expectedFolder: {
					type: 'folder',
					items: [{key: 'f1'}],
				},
			},
		];

		tests.forEach(test => {
			it(test.name, function () {
				assert.deepStrictEqual(
					layerTree.getFolderByLayerKey(test.layersTree, test.layerKey),
					test.expectedFolder
				);
			});
		});
	});

	describe('getFlattenLayers', function () {
		const tests = [
			{name: 'empty tree', layersTree: [], expectedLayers: []},
			{
				name: 'tree',
				layersTree: [
					{
						type: 'folder',
						name: 'f1',
						items: [
							{type: 'layerTemplate', name: 'f1-t1'},
							{type: 'folder', name: 'f1-f1', items: []},
						],
					},
					{type: 'layerTemplate', name: 't1'},
				],
				expectedLayers: [
					{type: 'layerTemplate', name: 't1'},
					{type: 'layerTemplate', name: 'f1-t1'},
				],
			},
		];

		tests.forEach(test => {
			it(test.name, function () {
				assert.deepStrictEqual(
					layerTree.getFlattenLayers(test.layersTree),
					test.expectedLayers
				);
			});
		});
	});

	describe('forAllTreeItems', function () {
		const tests = [
			{
				name: 'empty tree',
				layersTree: [],
				callback: () => 1,
				expectedResult: [],
			},
			{
				name: 'tree with folder and layer ignores nested layer?',
				layersTree: [
					{
						type: 'folder',
						name: 'f1',
						items: [
							{type: 'layerTemplate', name: 'f1-t1'},
							{type: 'folder', name: 'f1-f1', items: []},
						],
					},
					{type: 'layerTemplate', name: 't1'},
				],
				callback: item => item.name,
				expectedResult: ['t1'],
			},
			{
				name: 'tree with layer and folder returns empty array?',
				layersTree: [
					{type: 'layerTemplate', name: 't1'},
					{
						type: 'folder',
						name: 'f1',
						items: [
							{type: 'layerTemplate', name: 'f1-t1'},
							{type: 'folder', name: 'f1-f1', items: []},
						],
					},
				],
				callback: item => item.name,
				expectedResult: [],
			},
		];

		tests.forEach(test => {
			it(test.name, function () {
				assert.deepStrictEqual(
					layerTree.forAllTreeItems(test.layersTree, test.callback),
					test.expectedResult
				);
			});
		});
	});

	describe('getFlattenLayerTree', function () {
		const tests = [
			{name: 'empty tree', layersTree: {}, expectedResult: []},
			{
				name: 'tree',
				layersTree: {
					t1: [
						{
							type: 'folder',
							name: 'f1',
							items: [
								{type: 'layerTemplate', name: 'f1-t1'},
								{type: 'folder', name: 'f1-f1', items: []},
							],
						},
						{type: 'layerTemplate', name: 't1'},
					],
				},
				expectedResult: [
					{type: 'layerTemplate', name: 't1'},
					{type: 'layerTemplate', name: 'f1-t1'},
				],
			},
		];

		tests.forEach(test => {
			it(test.name, function () {
				assert.deepStrictEqual(
					layerTree.getFlattenLayerTree(test.layersTree),
					test.expectedResult
				);
			});
		});
	});

	describe('getLayerZindex', function () {
		const tests = [
			{
				name: 'present layer',
				layersTree: [],
				layerTemplateKey: 'l1',
				expectedResult: null,
			},
			{
				name: 'first layer',
				layersTree: {
					t1: [
						{
							type: 'folder',
							name: 'f1',
							items: [
								{
									type: 'layerTemplate',
									name: 'f1-t1',
									key: 'kf1-t1',
								},
								{type: 'folder', name: 'f1-f1', items: []},
							],
						},
						{type: 'layerTemplate', name: 't1', key: 'kt1'},
					],
				},
				layerTemplateKey: 'kt1',
				expectedResult: 0,
			},
			{
				name: 'second layer',
				layersTree: {
					t1: [
						{
							type: 'folder',
							name: 'f1',
							items: [
								{
									type: 'layerTemplate',
									name: 'f1-t1',
									key: 'kf1-t1',
								},
								{type: 'folder', name: 'f1-f1', items: []},
							],
						},
						{type: 'layerTemplate', name: 't1', key: 'kt1'},
					],
				},
				layerTemplateKey: 'kf1-t1',
				expectedResult: 1,
			},
		];

		tests.forEach(test => {
			it(test.name, function () {
				assert.strictEqual(
					layerTree.getLayerZindex(test.layersTree, test.layerTemplateKey),
					test.expectedResult
				);
			});
		});
	});
});
