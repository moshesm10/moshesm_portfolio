
const canvas = (Matter, windowWidth, windowHeight) => {
    
    const Engine = Matter.Engine,
          Render = Matter.Render,
          Runner = Matter.Runner,
          Vertices = Matter.Vertices,
          MouseConstraint = Matter.MouseConstraint,
          Mouse = Matter.Mouse,
          World = Matter.World,
          Svg = Matter.Svg,
          Events = Matter.Events,
          Bodies = Matter.Bodies;
    
    // create engine
    const engine = Engine.create(),
        world = engine.world;

    // create renderer
    const render = Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: windowWidth,
            height: windowHeight,
            background: '#E0D9D3',
            wireframes: false
        }
    });

    engine.world.gravity.y = 2;

    Render.run(render);

    // create runner
    const runner = Runner.create();
    Runner.run(runner, engine);

    // add mouse control
    const mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        });
    World.add(world, mouseConstraint);

    // add click handler
    const clickHandler = (id, link) => {
        Events.on(mouseConstraint, "enddrag", (e) => {
            const down = e.source.mouse.mousedownPosition,
                  up = e.source.mouse.mouseupPosition;
            if (down.x == up.x && down.y == up.y ) {
                if (id === e.body.id) {
                    document.location.assign(link);
                };
            };
        });
    };

    // == Edges ==
    const wallWidth = 100;
    
    World.add(world, [
        // x y width height
        
        Bodies.rectangle(windowWidth / 2, windowHeight + 50, windowWidth, wallWidth, { isStatic: true }), //bottom rectangle
        Bodies.rectangle(windowWidth / 2, -50, windowWidth, wallWidth, { isStatic: true }), //top rectangle
        Bodies.rectangle(-50, windowHeight/2, wallWidth, windowHeight, { isStatic: true }), //left rectangle
        Bodies.rectangle(windowWidth + 50, windowHeight/2, wallWidth, windowHeight, { isStatic: true }), //right rectangle
    ]);

    // == size variables ==
    const bodySize = (type) => {
        let size = 0,
            multiplier = 1;

        if (windowWidth < 420) {
            multiplier = 0.6;
        }

        if (windowWidth < 330) {
            multiplier = 0.5;
        }

        // For smartphones landscape orientation
        if (windowWidth > windowHeight && windowHeight < 420) {
                multiplier = 0.6;
    
            if (windowHeight < 330) {
                multiplier = 0.5;
            }
        }
 
        switch (type) {
            case 'circle':
                size = 120 * multiplier;
                break;
            case 'default':
                break;
        }

        return {
                size: size,
                multiplier: multiplier
            };
    };

    // == elements ==
    const bonds = Bodies.circle(windowWidth / 2, windowHeight / 2, bodySize('circle').size, {
        restitution: 0.5,
        render: {
          fillStyle: '#ff0000',
          sprite: {
            texture: '../img/topbonds.png',
            xScale: bodySize('circle').multiplier,
            yScale: bodySize('circle').multiplier
          }
        }
    });
    clickHandler(bonds.id, 'https://topbonds.ru');
    World.add(world, bonds);

const svgRender = (svgLink, svgTextureLink, xPos, yPos, link) => {
    fetch(svgLink)
        .then(data => data.text())
        .then(data => {
            let svgWrapper = document.createElement('div');
            svgWrapper.innerHTML = data;

            const svgPath = svgWrapper.querySelector('path'),
                  vertexSets = Vertices.scale(Vertices.hull(Svg.pathToVertices(svgPath, 1000)), bodySize().multiplier, bodySize().multiplier);

            const svgElement = Bodies.fromVertices(xPos, yPos, vertexSets, {
                restitution: 0.5,
                render: {
                    sprite: {
                        texture: svgTextureLink,
                        xScale: bodySize().multiplier,
                        yScale: bodySize().multiplier
                    }
                }
            }, true);

            // add click event
            clickHandler(svgElement.id, link);

            World.add(world, svgElement);
        });
};

svgRender('../img/imguploadersvg.svg', '../img/imguploader.png', windowWidth / 2, windowWidth / 2, 'http://a0413857.xsph.ru/image-uploader/');
svgRender('../img/windbnbsvg.svg', '../img/windbnb.png', windowWidth / 6, windowWidth / 6, 'http://a0413857.xsph.ru/windbnb/');
svgRender('../img/mainsvg.svg', '../img/main.png', windowWidth / 3, windowWidth / 3, 'https://github.com/moshesm10');
svgRender('../img/tctlsvg.svg', '../img/tctl.png', windowWidth / 4, windowWidth / 4, 'https://github.com/moshesm10');
svgRender('../img/schoolgurusvg.svg', '../img/schoolguru.png', windowWidth / 5, windowWidth / 5, 'https://github.com/moshesm10');
};

export default canvas;