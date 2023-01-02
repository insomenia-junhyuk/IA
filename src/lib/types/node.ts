import type { coordinate } from './coordinate';

export type node = {
	leftTop: coordinate;
	rightBottom: coordinate;
	count: number;
	bgColor: string;
	borderColor: string;
	textColor: string;
	id: Symbol;
	type: Symbol;
	content: string;
	children: node[];
};

export type nodeStyle = {
	x: number;
	y: number;
	bgColor: string;
};
