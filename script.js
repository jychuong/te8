// A tribute to Nyan Cat http://www.youtube.com/watch?v=QH2-TGUlwu4
var mediaElement;
var playing = false;
var mousePos = view.center + [view.bounds.width / 3, 100];
var position = view.center;

function onFrame(event) {
	position += (mousePos - position) / 10;
	var vector = (view.center - position) / 10;
	moveStars(vector * 1);
}

function onMouseMove(event) {
	mousePos = event.point;
}

function onKeyDown(event) {
	if (event.key == 'space')
		project.activeLayer.selected = !project.activeLayer.selected;
}

var moveStars = new function() {
	// The amount of symbol we want to place;
	var count = 150;

	// make triangles
	var path = new Path.RegularPolygon({
		point: [3],
		sides: [3],
		radius:[20],
		fillColor: 'pink',
		strokeWidth: 8,
		strokeColor: '#ADD8E6',
		shadowColor: 'blue',
		shadowBlur: 50

	});

	var symbol = new Symbol(path);

	// Place the instances of the symbol:
	for (var i = 0; i < count; i++) {
		// The center position is a random point in the view:
		var center = Point.random() * view.size;
		var placed = symbol.place(center);
		placed.scale(i / count + 0.01);
		placed.data = {
			vector: new Point({
				angle: Math.random() * 360,
				length : (i / count) * Math.random() / 5
			})
		};
	}

	function keepInView(item) {
		var position = item.position;
		var viewBounds = view.bounds;
		if (position.isInside(viewBounds))
			return;
		var itemBounds = item.bounds;
		if (position.x > viewBounds.width + 5) {
			position.x = -item.bounds.width;
		}

		if (position.x < -itemBounds.width - 5) {
			position.x = viewBounds.width;
		}

		if (position.y > viewBounds.height + 5) {
			position.y = -itemBounds.height;
		}

		if (position.y < -itemBounds.height - 5) {
			position.y = viewBounds.height
		}
	}

	return function(vector) {
		path.rotate(2);
		path.fillColor.hue += 1;
		// Run through the active layer's children list and change
		// the position of the placed symbols:
		var layer = project.activeLayer;
		for (var i = 0; i < count; i++) {
			var item = layer.children[i];
			var size = item.bounds.size;
			var length = vector.length / 10 * size.width / 10;
			item.position += vector.normalize(length) + item.data.vector;
			keepInView(item);
		}
	};
};
