import * as THREE from 'three'
import { run, scene, camera, renderer, update } from 'three-kit'
import Inspector from 'three-inspect'

THREE.ColorManagement.legacyMode = false

camera.position.set(0, 2, 10)

const cubeTextureLoader = new THREE.CubeTextureLoader()
const textureLoader = new THREE.TextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg'
])

const backgroundTexture = textureLoader.load('/textures/environmentMaps/0/nx.jpg')
scene.background = backgroundTexture

let meshes: THREE.Object3D[] = []
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
  const material = new THREE.MeshStandardMaterial(/* { color: 'darksalmon' } */)
  material.envMap = environmentMapTexture
  material.envMapIntensity = 1
  materials.push(material)
  
  const repeatX = 10

  const colorTexture = await textureLoader.loadAsync('/textures/metal_plate/MetalPlateStudded001_COL_2K_METALNESS.png')
  colorTexture.wrapS = colorTexture.wrapT = THREE.RepeatWrapping
  colorTexture.repeat.x = repeatX

  const aoTexture = await textureLoader.loadAsync('/textures/metal_plate/MetalPlateStudded001_AO_2K_METALNESS.png')
  aoTexture.wrapS = aoTexture.wrapT = THREE.RepeatWrapping
  aoTexture.repeat.x = repeatX

  // const bumpTexture = await textureLoader.loadAsync('/textures/metal_plate/MetalPlateStudded001_BUMP_2K_METALNESS.png')
  // bumpTexture.wrapS = bumpTexture.wrapT = THREE.RepeatWrapping
  // bumpTexture.repeat.x = repeatX

  const dispTexture = await textureLoader.loadAsync('/textures/metal_plate/MetalPlateStudded001_DISP_2K_METALNESS.png')
  dispTexture.wrapS = dispTexture.wrapT = THREE.RepeatWrapping
  dispTexture.repeat.x = repeatX

  const normalTexture = await textureLoader.loadAsync('/textures/metal_plate/MetalPlateStudded001_NRM_2K_METALNESS.png')
  normalTexture.wrapS = normalTexture.wrapT = THREE.RepeatWrapping
  normalTexture.repeat.x = repeatX

  const roughTexture = await textureLoader.loadAsync('/textures/metal_plate/MetalPlateStudded001_ROUGHNESS_2K_METALNESS.png')
  roughTexture.wrapS = roughTexture.wrapT = THREE.RepeatWrapping
  roughTexture.repeat.x = repeatX

  const metalTexture = await textureLoader.loadAsync('/textures/metal_plate/MetalPlateStudded001_ROUGHNESS_2K_METALNESS.png')
  metalTexture.wrapS = metalTexture.wrapT = THREE.RepeatWrapping
  metalTexture.repeat.x = repeatX

  material.map = colorTexture
  material.aoMap = aoTexture
  // material.bumpMap = bumpTexture
  material.displacementMap = dispTexture
  material.displacementScale = 0.005
  material.normalMap = normalTexture
  material.roughnessMap = roughTexture
  material.metalnessMap = metalTexture

  material.roughness = 0.17
  material.metalness = 0.95

  const mesh = new THREE.Mesh(geometry, material)
  mesh.name = 'Torus Knot'
  mesh.position.x = -4
  scene.add(mesh)
  meshes.push(mesh)
}

// Add a torus / donut
{
  const geometry = new THREE.TorusGeometry(size / 2, size / 10, 30, 100)
  const material = new THREE.MeshPhysicalMaterial()
  material.envMap = environmentMapTexture
  material.envMapIntensity = 1
  material.roughness = 0.17
  material.metalness = 0.95
  materials.push(material)

  const mesh = new THREE.Mesh(geometry, material)
  mesh.name = 'Torus / Donut'
  mesh.position.x = 4
  scene.add(mesh)
  meshes.push(mesh)
}

// Add a Cylinder
{
  const geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 40)
  const edges = new THREE.EdgesGeometry( geometry, 1 );
  const line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0xffffff } ) );
  line.name = 'Cylinder'
  line.position.x = 6

  scene.add(line)
  meshes.push(line)
}

// Add a Plane
{
  const material = new THREE.MeshPhysicalMaterial()
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    material
  )

  material.side = THREE.DoubleSide


  mesh.name = 'Plane'
  mesh.position.x = -6
  scene.add(mesh)
}

// Add a torus / donut
{
  const points = [];
  for ( let i = 0; i < 10; i ++ ) {
    points.push( new THREE.Vector2( Math.sin( i * 0.2 ) * 10 + 5, ( i - 5 ) * 2 ) );
  }

  const geometry = new THREE.LatheGeometry(points, 30)
  const material = new THREE.MeshPhysicalMaterial()
  material.envMap = environmentMapTexture
  material.envMapIntensity = 1
  material.opacity = 0.5
  material.transparent = true
  material.transmission = 0.5
  material.side = THREE.DoubleSide
  materials.push(material)

  const mesh = new THREE.Mesh(geometry, material)
  mesh.name = 'Torus / Donut'
  mesh.position.x = 8
  mesh.scale.setScalar(0.05)
  scene.add(mesh)
  meshes.push(mesh)
}

for (const mesh of meshes) {
  mesh.castShadow = true
  mesh.receiveShadow = true
}

update(() => {
  for (const mesh of meshes) {
    mesh.rotation.y += 0.01
  }
})

new Inspector(THREE, scene, camera, renderer)

run()