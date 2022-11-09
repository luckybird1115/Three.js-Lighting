import logo from './logo.svg';

import './App.css';

import React, { useEffect, useState } from 'react';
import * as THREE from 'three';

import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MapControls, OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { MeshLambertMaterial } from 'three';


var bgTexture, bgWidth, bgHeight;
let texLoader = new THREE.TextureLoader();

const App = () => {

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.4;

  const orbit = new OrbitControls(camera, renderer.domElement);
  orbit.minDistance = 5;
  orbit.maxDistance = 20;
  orbit.maxPolarAngle = 1.5;
  orbit.minAzimuthAngle = .1;


  camera.position.set(0, 0, 5)

  const textureloader = new THREE.TextureLoader();
  bgTexture = textureloader.load(
    'assets/image/bg.png',
    function (texture) {
      var img = texture.image;
      bgWidth = img.width;
      bgHeight = img.height;
      resize();
    }
  )

  const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
scene.add( light );
  
  texLoader.load('assets/hdri.jpg', function (texture) {
    var pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    var envMap = pmremGenerator.fromEquirectangular(texture).texture;

    scene.environment = envMap;


    texture.dispose();

    pmremGenerator.dispose();



  });

  scene.background = bgTexture;
  bgTexture.wrapS = THREE.MirroredRepeatWrapping;
  bgTexture.wrapT = THREE.MirroredRepeatWrapping;

  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath(
    'https://cdn.jsdelivr.net/npm/three@0.145.0/examples/js/libs/draco/'
  )

  const loader = new GLTFLoader()
  loader.setDRACOLoader(dracoLoader)
  // let new_mat = new THREE.MeshLambertMaterial({ color: 0xffffff});
  loader.load(
    'assets/model/test.glb',
    function (gltf) {
      scene.add(gltf.scene);
      gltf.scene.traverse(obj => {
        if (obj instanceof THREE.Mesh) {
        }
      })

    }
  )

  const animate = () => {
    requestAnimationFrame(animate);
    orbit.update()

    renderer.render(scene, camera);

  }

  const resize = () => {
    var aspect = window.innerWidth / window.innerHeight;
    var texAspect = bgWidth / bgHeight;
    var relAspect = aspect / texAspect;

    bgTexture.repeat = new THREE.Vector2(Math.max(relAspect, 1), Math.max(1 / relAspect, 1));
    bgTexture.offset = new THREE.Vector2(-Math.max(relAspect - 1, 0) / 2, -Math.max(1 / relAspect - 1, 0) / 2);

    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
  }

  animate()

  window.addEventListener('resize', resize, false);

  return (
    <></>
  );
}

export default App;
