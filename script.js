// A tribute to Nyan Cat http://www.youtube.com/watch?v=QH2-TGUlwu4
var mediaElement;
var playing = false;
var mousePos = view.center + [view.bounds.width / 3, 100];
var position = view.center;

function onFrame(event) {
	position += (mousePos - position) / 10;
	var vector = (view.center - position) / 10;
	moveStars(vector * 3);
	moveRainbow(vector, event);
}

function onMouseMove(event) {
	mousePos = event.point;
}

var moveStars = new function() {
	// The amount of symbol we want to place;
	var count = 50;

	// Create a symbol, which we will use to place instances of later:
	var path = new Path.Circle({
		center: [0, 0],
		radius: 5,
		fillColor: 'black',
		strokeColor: 'white'
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

var moveRainbow = new function() {
	var paths = [];
	var colors = ['red', 'orange', 'yellow', 'lime', 'blue', 'purple'];
	for (var i = 0; i < colors.length; i++) {
		var path = new Path({
			fillColor: colors[i]
		});
		paths.push(path);
	}

	var count = 30;
	var group = new Group(paths);
	var headGroup;
	var eyePosition = new Point();
	var eyeFollow = (Point.random() - 0.5);
	var blinkTime = 200;


	return function(vector, event) {
		var vector = (view.center - position) / 10;

		if (vector.length < 5)
			vector.length = 5;
		count += vector.length / 100;
		group.translate(vector);
		var rotated = vector.rotate(90);
		var middle = paths.length / 2;
		for (var j = 0; j < paths.length; j++) {
			var path = paths[j];
			var nyanSwing = playing ? Math.sin(event.count / 2) * vector.length : 1;
			var unitLength = vector.length * (2 + Math.sin(event.count / 10)) / 2;
			var length = (j - middle) * unitLength + nyanSwing;
			var top = view.center + rotated.normalize(length);
			var bottom = view.center + rotated.normalize(length + unitLength);
			path.add(top);
			path.insert(0, bottom);
			if (path.segments.length > 200) {
				var index = Math.round(path.segments.length / 2);
				path.segments[index].remove();
				path.segments[index - 1].remove();
			}
			path.smooth();
		}
	}
}
