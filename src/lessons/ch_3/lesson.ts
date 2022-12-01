import * as THREE from 'three'
import { run, scene, camera, renderer, update } from 'three-kit'
import Inspector from 'three-inspect'

THREE.ColorManagement.legacyMode = false

camera.position.set(0, 2, 10)

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

update(() => {
  
})

new Inspector(THREE, scene, camera, renderer)

run()
