<script lang="ts">
	import type { node } from '$lib/types/node';
	import { Canvas, Layer, t } from 'svelte-canvas';
	import { getHoveredNode } from '$lib/utils';
	import { nodeTypes } from '$lib/constants';
	import {
		createNode,
		moveNode,
		doSelection,
		undoSelection,
		doCreation
	} from '$lib/components/Node';

	let nodes: node[] = [];

	// node 선택
	$: beforeNode = null;
	$: currentNode = null;

	// mouse 틀릭 : up, down 소요 시간
	let startClick = new Date();
	let endClick = new Date();
	let keepDrag = false;

	const handleClick = (e: MouseEvent) => {
		const ctx = e.target?.getContext('2d');
		const posX = e.offsetX;
		const posY = e.offsetY;

		const nodeHovered = getHoveredNode({ x: posX, y: posY }, nodes);

		// 이미 생성된 사각형을 클릭 : 해당 사각형 데이터 보여주기 + 드래그 가능
		if (nodeHovered !== null) {
			beforeNode = currentNode;
			currentNode = nodeHovered;
			undoSelection(beforeNode, ctx);
			doSelection(currentNode, ctx);
			return;
		}

		// 이외의 클릭 -> 새로운 노드 생성
		if (doCreation({ start: startClick, end: endClick, currentNode })) {
			createNode({ x: posX, y: posY, bgColor: '#369143' }, nodes, ctx);
			return;
		} else {
			beforeNode = currentNode;
			currentNode = null;
			undoSelection(beforeNode, ctx);
		}
	};

	const handleMouseDown = (e: MouseEvent) => {
		startClick = new Date();
		keepDrag = true;
	};

	const handleMouseUp = (e: MouseEvent) => {
		endClick = new Date();
		keepDrag = false;
	};

	const handleMouseMove = (e: MouseEvent) => {
		const ctx = e.target?.getContext('2d');
		const posX = e.offsetX;
		const posY = e.offsetY;
		if (currentNode === null) return;
		if (!keepDrag) return;
		nodes = moveNode(currentNode, { toX: posX, toY: posY }, nodes, ctx);
	};
</script>

<div class="div__container--ia-block">
	<div class="div__container--canvas-block">
		<Canvas
			width={4000}
			height={4000}
			on:click={handleClick}
			on:mousedown={handleMouseDown}
			on:mouseup={handleMouseUp}
			on:mousemove={handleMouseMove}
		/>
	</div>
	<div class="div__container--nodedata-block">
		<div>
			<label for="content">노드 내용</label>
			<input type="text" id="content" />
		</div>
		<div>
			<label for="content">노드 타입</label>
			<select id="type">
				{#each Object.entries(nodeTypes) as [key, value]}
					<option>{value.name}</option>
				{/each}
				<option value="" />
			</select>
		</div>
	</div>
</div>

<style>
	.div__container--ia-block {
		width: 100%;
		height: 100%;
		padding: 12px;
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
	.div__container--canvas-block {
		width: 80%;
		height: 70%;
		border: 2px solid black;
		overflow: auto;
	}
	.div__container--nodedata-block {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
</style>
