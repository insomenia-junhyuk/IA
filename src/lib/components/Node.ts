import type { nodeStyle, node } from '$lib/types/node';
import { nodeWidth, nodeHeight, nodeRadius } from '$lib/constants';

function getXY({ x, y }: { x: number; y: number }) {
	return { x: x - nodeWidth / 2, y: y - nodeHeight / 2 };
}

function eraseRectangle({ x, y }: { x: number; y: number }, ctx: CanvasRenderingContext2D) {
	const offset = 3;
	const offsetNodeWidth = nodeWidth + offset * 2;
	const offsetNodeHeight = nodeHeight + offset * 2;
	x -= offset;
	y -= offset;
	ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.lineTo(x + offsetNodeWidth, y);
	ctx.lineTo(x + offsetNodeWidth, y + offsetNodeHeight);
	ctx.lineTo(x, y + offsetNodeHeight);
	ctx.lineTo(x, y);
	ctx.closePath();

	ctx.fillStyle = '#ffffff';
	ctx.fill();
}

export function drawRectangle(
	{ x, y }: { x: number; y: number },
	bgColor: string,
	ctx: CanvasRenderingContext2D
) {
	ctx.beginPath();
	ctx.moveTo(x + nodeRadius, y);
	ctx.arcTo(x + nodeWidth, y, x + nodeWidth, y + nodeHeight, nodeRadius);
	ctx.arcTo(x + nodeWidth, y + nodeHeight, x, y + nodeHeight, nodeRadius);
	ctx.arcTo(x, y + nodeHeight, x, y, nodeRadius);
	ctx.arcTo(x, y, x + nodeWidth, y, nodeRadius);
	ctx.closePath();

	ctx.fillStyle = bgColor;
	ctx.fill();
}

export function createNode(style: nodeStyle, nodes: node[], ctx: CanvasRenderingContext2D) {
	const { x, y, bgColor } = { ...getXY({ x: style.x, y: style.y }), bgColor: style.bgColor };

	drawRectangle({ x, y }, bgColor, ctx);

	return (nodes[nodes.length] = {
		leftTop: { x, y },
		rightBottom: { x: x + nodeWidth, y: y + nodeHeight },
		count: nodes.length === 0 ? 1 : nodes[nodes.length - 1].count + 1,
		bgColor,
		id: Symbol('node')
	});
}

export function moveNode(
	target: node,
	{ toX, toY }: { toX: number; toY: number },
	nodes: node[],
	ctx: CanvasRenderingContext2D
) {
	// 선택된 노드 위치 재연산
	const { x, y } = { ...getXY({ x: toX, y: toY }) };

	// 선택 제거
	undoSelection(target, ctx);

	// 기존 노드를 다시 그린다.
	eraseRectangle({ ...target.leftTop }, ctx);

	// node들 중 target에 해당하는 node의 위치 정보를 수정한 뒤 다시 그린다.
	nodes = nodes.map((node) => {
		if (node.id === target.id) {
			node.leftTop = { x, y };
			node.rightBottom = { x: x + nodeWidth, y: y + nodeHeight };
		}
		drawRectangle({ ...node.leftTop }, node.bgColor, ctx);
		return node;
	});

	// 선택된 노드 감싸는 border 다시 생성
	target = nodes.filter((node) => node.id === target.id)[0];
	doSelection(target, ctx);

	return nodes;
}

// 선택됬을 경우 node를 둘러싸는 검은 선을 생성함
export function doSelection(target: node | null, ctx: CanvasRenderingContext2D) {
	if (target === null) return;
	const { x, y } = { ...target.leftTop };
	ctx.beginPath();
	ctx.moveTo(x + nodeRadius, y);
	ctx.arcTo(x + nodeWidth, y, x + nodeWidth, y + nodeHeight, nodeRadius);
	ctx.arcTo(x + nodeWidth, y + nodeHeight, x, y + nodeHeight, nodeRadius);
	ctx.arcTo(x, y + nodeHeight, x, y, nodeRadius);
	ctx.arcTo(x, y, x + nodeWidth, y, nodeRadius);
	ctx.closePath();

	ctx.lineWidth = 1.5;
	ctx.strokeStyle = 'black';
	ctx.stroke();
}

// 선택해제된 경우 node를 둘러싸는 검은 선을 제거한
export function undoSelection(target: node | null, ctx: CanvasRenderingContext2D) {
	if (target === null) return;
	const { x, y } = { ...target.leftTop };
	ctx.beginPath();
	ctx.moveTo(x + nodeRadius, y);
	ctx.arcTo(x + nodeWidth, y, x + nodeWidth, y + nodeHeight, nodeRadius);
	ctx.arcTo(x + nodeWidth, y + nodeHeight, x, y + nodeHeight, nodeRadius);
	ctx.arcTo(x, y + nodeHeight, x, y, nodeRadius);
	ctx.arcTo(x, y, x + nodeWidth, y, nodeRadius);
	ctx.closePath();

	ctx.lineWidth = 2;
	ctx.strokeStyle = target.bgColor;
	ctx.stroke();
}

// 클릭 오래하는 경우 node 생성 안하도록함
export const doCreation = ({
	start,
	end,
	currentNode
}: {
	start: Date;
	end: Date;
	currentNode: node;
}) => {
	return end.getTime() - start.getTime() < 200 && currentNode === null;
};
