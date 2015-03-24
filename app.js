// Generated by CoffeeScript 1.9.0
var Punyverse, camera1, camera2, config, engine, punyverse,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __hasProp = {}.hasOwnProperty;

THREEx.Planets.baseURL = 'bower_components/threex.planets/';

THREEx.SpaceShips.baseUrl = 'bower_components/threex.spaceships/';

THREEx.TextureCube.baseUrl = "";

config = Config.get();

config.preventDefaultMouseEvents = false;

config.fillWindow();

engine = new Engine3D();

engine.renderer.setClearColor('black', 1);

engine.setCursor('images/pointer.png');

camera1 = new THREE.PerspectiveCamera(60, config.width / config.height, 0.1, 10000);

camera1.position.y = 1;

camera1.position.z = 4;

camera2 = new THREE.PerspectiveCamera(60, config.width / config.height, 0.1, 10000);

engine.setCamera(camera1);

THREE.MOUSE = {
  LEFT: 0,
  MIDDLE: 1,
  RIGHT: 2
};

Math.RADIAN = 57.2957795;

Punyverse = (function(_super) {
  __extends(Punyverse, _super);

  function Punyverse() {
    var light, mesh;
    Punyverse.__super__.constructor.call(this);
    this.loaded = false;
    this.universeSize = 1500;
    this.timeSpeed = 1;
    this.currentTime = Date.now();
    light = new THREE.AmbientLight(0xFFFFFF);
    this.scene.add(light);
    mesh = THREEx.createSkymap({
      cubeW: this.universeSize,
      cubeH: this.universeSize,
      cubeD: this.universeSize,
      textureCube: THREEx.createTextureCube('skybox')
    });
    this.scene.add(mesh);
    this.earth = new Planet('earth', 10, 0, 'earthmap1k', 'cyan', 0);
    this.earth.clouds.setVisible(true);
    this.scene.add(this.earth.mesh);
    this.moon = new Planet('moon', 3, 25, 'moonmap1k', 'white', 0.001);
    this.moon.setDateRotation(this.currentTime);
    this.scene.add(this.moon.mesh);
    this.mercury = new Planet('mercury', 0.5, 30, 'mercurymap', 'red', 0.003);
    this.mercury.setDateRotation(this.currentTime);
    this.scene.add(this.mercury.mesh);
    this.venus = new Planet('venus', 0.5, 45, 'venusmap', 'red', 0.004);
    this.venus.ring.setVisible(true);
    this.venus.setDateRotation(this.currentTime);
    this.scene.add(this.venus.mesh);
    this.sun = new Planet('sun', 40, 100, 'sunmap', 'yellow', 0.0005);
    this.sun.glow.setVisible(true);
    this.sun.setDateRotation(this.currentTime);
    this.scene.add(this.sun.mesh);
    this.jupiter = new Planet('jupiter', 30, 200, 'jupitermap', 'orange', 0.006);
    this.jupiter.ring.setVisible(true);
    this.jupiter.setDateRotation(this.currentTime);
    this.scene.add(this.jupiter.mesh);
    this.saturn = new Planet('saturn', 20, 300, 'saturnmap', 'brown', 0.003);
    this.saturn.ring.setVisible(true);
    this.saturn.setDateRotation(this.currentTime);
    this.scene.add(this.saturn.mesh);
    THREEx.SpaceShips.loadSpaceFighter01((function(_this) {
      return function(object3d) {
        var f1, f2, f3;
        _this.pivot = new THREE.Object3D();
        _this.ship = new Ship('protoss', object3d);
        _this.ship.mesh.position.z = 100;
        _this.scene.add(_this.ship.mesh);
        _this.pivot.add(camera1);
        _this.ship.mesh.add(_this.pivot);
        _this.flyControls = new THREE.FlyControls(_this.ship.mesh, engine.renderer.domElement);
        _this.flyControls.autoForward = false;
        _this.flyControls.dragToLook = false;
        _this.gui = new dat.GUI();
        f1 = _this.gui.addFolder('Position');
        f1.add(_this.ship.mesh.position, 'x').listen();
        f1.add(_this.ship.mesh.position, 'y').listen();
        f1.add(_this.ship.mesh.position, 'z').listen();
        f1.open();
        f2 = _this.gui.addFolder('Rotation');
        f2.add(_this.ship.mesh.rotation, 'x').step(0.001).listen();
        f2.add(_this.ship.mesh.rotation, 'y').step(0.001).listen();
        f2.add(_this.ship.mesh.rotation, 'z').step(0.001).listen();
        f2.open();
        f3 = _this.gui.addFolder('Time');
        f3.add(_this, 'timeSpeed');
        f3.add(_this, 'realCurrentTime').listen();
        f3.add(_this, 'currentTime').listen();
        f3.open();
        _this.loaded = true;
      };
    })(this));
    this.bullets = [];
    this.axes = new CoffeeAxes(this.universeSize / 2);
    this.scene.add(this.axes.mesh);
  }

  Punyverse.prototype.tick = function(tpf) {
    var b, bullet, mv, _i, _len, _ref, _results;
    this.tpf = tpf;
    this.realCurrentTime = Date.now();
    this.currentTime += tpf * 1000 * this.timeSpeed;
    this.earth.animateClouds(tpf * this.timeSpeed);
    this.moon.setDateRotation(this.currentTime);
    this.mercury.setDateRotation(this.currentTime);
    this.venus.setDateRotation(this.currentTime);
    this.sun.setDateRotation(this.currentTime);
    this.jupiter.setDateRotation(this.currentTime);
    this.saturn.setDateRotation(this.currentTime);
    if (!this.loaded) {
      return;
    }
    if (this.flyControls != null) {
      this.flyControls.update(tpf);
      this.flyControls.movementSpeed = 2000 * tpf * this.timeSpeed;
      this.flyControls.strafeSpeed = 1000 * tpf * this.timeSpeed;
      this.flyControls.rollSpeed = Math.PI / 24 * 4 * this.timeSpeed;
      mv = this.flyControls.moveVector;
      b = !(mv.x === 0 && mv.y === 0 && mv.z === 0);
      this.ship.rightDetonation.visible = b;
      this.ship.leftDetonation.visible = b;
    }
    _ref = this.bullets;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      bullet = _ref[_i];
      _results.push(bullet.translateZ(-60 * tpf * this.timeSpeed));
    }
    return _results;
  };

  Punyverse.prototype.doMouseEvent = function(event, raycaster) {
    if (!this.loaded) {

    }
  };

  Punyverse.prototype.doKeyboardEvent = function(event) {
    var bullet;
    if (!this.loaded) {
      return;
    }
    if (event.type !== 'keyup') {
      return;
    }
    if (event.which === 32) {
      bullet = this.ship.spawnBullet();
      this.bullets.push(bullet);
      return this.scene.add(bullet);
    }
  };

  return Punyverse;

})(BaseScene);

punyverse = new Punyverse();

engine.addScene(punyverse);

engine.render();
