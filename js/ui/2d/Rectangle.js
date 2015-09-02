var Rectangle = function(vertices) {
    Polygon.call(this);
    this.width = vertices[Rectangle.XY.BottomRight].x - vertices[Rectangle.XY.TopLeft].x;
    this.height = vertices[Rectangle.XY.BottomRight].y - vertices[Rectangle.XY.TopLeft].y;
};

Rectangle.XY = {
    TopLeft: 0,
    BottomRight: 1
};

Rectangle.boundary = function(polygon) {
    const MAXINT = Number.MAX_VALUE;
    let topLeft = new XY(MAXINT, MAXINT);
    let bottomRight = new XY(0,0);
    let vertices = polygon.vertices;

    // determine boundaries by sorting xy coordinates of every vertex
    for (let i = 0; i < vertices.length; ++i) {
        let xy = vertices[i];

        if (xy.x < topLeft.x)
            topLeft.x = xy.x;
        if (xy.x > bottomRight.x)
            bottomRight.x = xy.x;
        if (xy.y < topLeft.y)
            topLeft.y = xy.y;
        if (xy.y > topLeft.y)
            bottomRight.y = xy.y;
    }

    return new Rectangle([topLeft, bottomRight]);
};

Rectangle.prototype = Object.create(Rectangle.prototype, Polygon);


Rectangle.prototype.contains = function(xy) {
    return ( xy.x >= this.vertices[0].x && xy.x <= this.vertices[1].x
        && xy.y >= this.vertices[0].y && xy.y <= this.vertices[1].y );
};