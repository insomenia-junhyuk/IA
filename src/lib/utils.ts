import type { node } from './types/node';
import type { coordinate } from './types/coordinate';
import { nodeWidth, nodeHeight, nodeRadius } from '$lib/constants';

// 마우스가 노드 위에 있는지 판단
const mouseOutOfBound = (mouse: coordinate, node: node) => {
	if (node.leftTop.x > mouse.x || node.rightBottom.x < mouse.x) return true;
	if (node.leftTop.y > mouse.y || node.rightBottom.y < mouse.y) return true;
	return false;
};

// 노드가 노드 위에 있는지 판단
const nodeOutofBound = (base: node, other: node) => {
	return true;
};

// 마우스 - Node 중첩 여부
export const getHoveredNode = (mouse: coordinate, nodes: node[]) => {
	const targetRectangle = nodes
		.filter((node) => {
			return !mouseOutOfBound(mouse, node);
		})
		.sort((node1, node2) => node2.count - node1.count);
	return targetRectangle.length > 0 ? targetRectangle[0] : null;
};

// Node - Node 중첩 여부 (구현 안됨)
export const getCoveredNode = (base: node, nodes: node[]) => {
	const targetRectangle = nodes
		.filter((other) => {
			return !nodeOutofBound(base, other);
		})
		.sort((node1, node2) => node2.count - node1.count);
	return targetRectangle.length > 0 ? targetRectangle[0] : null;
};
