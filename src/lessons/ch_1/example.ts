import * as THREE from 'three'
import Inspector from 'three-inspect'
import { resizeRendererToDisplaySize } from '../../lib/resize'

const renderer = new THREE.WebGLRenderer()
renderer.physicallyCorrectLights = true
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

const camera = new THREE.PerspectiveCamera()
camera.position.set(5, 5, -5)
camera.lookAt(0, 0, 0)

const scene = new THREE.Scene()
scene.add(camera)

{
  const light = new THREE.AmbientLight('#a95959')
  light.intensity = 0.5
  scene.add(light)
}

{
  const light = new THREE.DirectionalLight('#d0b99a')
  light.castShadow = true
  light.shadow.mapSize.width = 2048
  light.shadow.mapSize.height = 2048
  light.position.set(2, 5, 2)
  scene.add(light)
}

{
  const geometry = new THREE.BoxGeometry()
  const material = new THREE.MeshStandardMaterial()
  const mesh = new THREE.Mesh(geometry, material)
  mesh.castShadow = mesh.receiveShadow = true
  mesh.position.set(0, 0.5, 0)
  mesh.name = 'Box'
  scene.add(mesh) 
}

{
  const size = 10
  const geometry = new THREE.BoxGeometry(size, size, 0.1).rotateX(Math.PI / 2)
  const material = new THREE.MeshStandardMaterial()
  const mesh = new THREE.Mesh(geometry, material)
  mesh.castShadow = mesh.receiveShadow = true
  mesh.name = 'Floor'
  scene.add(mesh)
}

const inspect = new Inspector(THREE, scene, camera, renderer)

const frame = () => {
  requestAnimationFrame(frame)
  resizeRendererToDisplaySize(renderer, camera)
  renderer.render(scene, camera)
}

requestAnimationFrame(frame)
