import * as THREE from 'three'
import { run, scene, camera, renderer, update } from 'three-kit'
import Inspector from 'three-inspect'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { EffectComposer, EffectPass, RenderPass, SepiaEffect } from "postprocessing";
import { resizeRendererToDisplaySize } from '../../lib/resize';

new Inspector(THREE, scene, camera, renderer)

const loader = new GLTFLoader()

loader.setPath('/glb/')

THREE.ColorManagement.legacyMode = false

camera.position.set(0, 2, 10)

scene.add(camera)

// Add an ambient light
{
  const ambient = new THREE.AmbientLight()
  ambient.intensity = 0.8
  scene.add(ambient)
}

// Add a directional light
{
  const directional = new THREE.DirectionalLight()
  directional.castShadow = true
  directional.shadow.mapSize.height = 1024
  directional.shadow.mapSize.width = 1024
  directional.intensity = 1.5
  scene.add(directional)
  directional.position.set(3, 5, 3)
}
const building = await loader.loadAsync('building.glb')


const mixer = new THREE.AnimationMixer( building.scene );


update(() => {
  
})

scene.add(building.scene)
console.log(building.animations)

const action = mixer.clipAction( building.animations[0] );
action.play();

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new EffectPass(camera, new SepiaEffect()));

update(() => {
  mixer.update(0.05)
})

run()
