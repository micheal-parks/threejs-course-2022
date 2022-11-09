import * as THREE from 'three'
import { run, scene, camera, renderer, update } from 'three-kit'
import Inspector from 'three-inspect'

renderer.shadowMap.enabled = true

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
  directional.intensity = 1.5
  scene.add(directional)
  directional.position.set(3, 5, 3)
}

{
  const spot = new THREE.SpotLight()
  spot.castShadow = true
  scene.add(spot)
}

{
  const point = new THREE.PointLight()
  point.castShadow = true
  scene.add(point)
}

{
  const rect = new THREE.RectAreaLight()
  rect.castShadow = true
  scene.add(rect)
}

{
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshStandardMaterial()
  const mesh = new THREE.Mesh(geometry, material)
  mesh.castShadow = true
  mesh.receiveShadow = true
  scene.add(mesh)
}

// Add the floor
{
  const geometry = new THREE.BoxGeometry(20, 5, 0.1).rotateX(Math.PI / 2).translate(0, -1, 0)
  const material = new THREE.MeshStandardMaterial({ color: 'lightslategrey' })

  const mesh = new THREE.Mesh(geometry, material)
  mesh.name = 'Floor'
  mesh.castShadow = mesh.receiveShadow = true
  scene.add(mesh)
}


update(() => {
  
})

new Inspector(THREE, scene, camera, renderer)

run()