import * as THREE from 'three'
import { resizeRendererToDisplaySize } from '../../lib/resize'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Debug from 'three-debug'

const renderer = new THREE.WebGLRenderer({
  antialias: true,
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

THREE.ColorManagement.legacyMode = false

const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg'
])

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera()
camera.near = 0.001
camera.far = 100
camera.position.set(0, 10, 20)
camera.lookAt(0, 0, 0)
scene.add(camera)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

let meshes: THREE.Mesh[] = []
let materials: THREE.Material[] = []

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

// Add the floor
{
  const geometry = new THREE.BoxGeometry(20, 5, 0.1).rotateX(Math.PI / 2).translate(0, -1, 0)
  const material = new THREE.MeshPhysicalMaterial({ color: 'lightslategrey' })
  material.envMap = environmentMapTexture
  material.envMapIntensity = 1
  material.reflectivity = 1
  material.clearcoat = 1
  material.clearcoatRoughness = 0.08
  materials.push(material)

  const mesh = new THREE.Mesh(geometry, material)
  mesh.name = 'Floor'
  mesh.castShadow = mesh.receiveShadow = true
  scene.add(mesh)
}

const size = 1

// Add a box
{
  const geometry = new THREE.BoxGeometry(size, size, size)
  const material = new THREE.MeshBasicMaterial({ color: 'yellow' })
  materials.push(material)

  const mesh = new THREE.Mesh(geometry, material)
  mesh.name = 'Box'
  scene.add(mesh)
  meshes.push(mesh)
}

// Add a cartoonish cone
{
  const geometry = new THREE.ConeGeometry(size / 2, size, 50, 50)
  const material = new THREE.MeshToonMaterial({ color: 'hotpink' })
  materials.push(material)

  const mesh = new THREE.Mesh(geometry, material)
  mesh.name = 'Cone'
  mesh.position.x = 2
  scene.add(mesh)
  meshes.push(mesh)
}

// Add a sphere
{
  const geometry = new THREE.SphereGeometry(size / 2, 100, 100)
  const material = new THREE.MeshPhongMaterial({ color: 'lightblue' })
  material.envMap = environmentMapTexture
  material.envMapIntensity = 0.1
  materials.push(material)

  const mesh = new THREE.Mesh(geometry, material)
  mesh.name = 'Sphere'
  mesh.position.x = -2
  scene.add(mesh)
  meshes.push(mesh)
}

// Add a torus knot
{
  const geometry = new THREE.TorusKnotGeometry(size / 2, size / 10, 200, 200)
  const material = new THREE.MeshStandardMaterial({ color: 'darksalmon' })
  material.envMap = environmentMapTexture
  material.envMapIntensity = 1
  materials.push(material)

  const mesh = new THREE.Mesh(geometry, material)
  mesh.name = 'Torus Knot'
  mesh.position.x = -4
  scene.add(mesh)
  meshes.push(mesh)
}

// Add a torus / donut
{
  const geometry = new THREE.TorusGeometry( size / 2, size / 10, 30, 100 );
  const material = new THREE.MeshPhysicalMaterial({  })
  material.envMap = environmentMapTexture
  material.envMapIntensity = 1
  material.roughness = 0.17
  material.metalness = 1
  materials.push(material)

  const mesh = new THREE.Mesh(geometry, material)
  mesh.name = 'Torus / Donut'
  mesh.position.x = 4
  scene.add(mesh)
  meshes.push(mesh)
}

for (const mesh of meshes) {
  mesh.castShadow = true
  mesh.receiveShadow = true
}

const frame = () => {
  requestAnimationFrame(frame)

  for (const mesh of meshes) {
    mesh.rotation.y += 0.01
  }

  resizeRendererToDisplaySize(renderer, camera)

  renderer.render(scene, camera)
  controls.update()
}

document.body.append(renderer.domElement)

requestAnimationFrame(frame)

new Debug(THREE, scene, camera, renderer)