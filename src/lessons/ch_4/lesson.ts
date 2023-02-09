import * as THREE from 'three'
import { run, scene, camera, renderer, update } from 'three-kit'
import Inspector from 'three-inspect'

import RAPIER from '@dimforge/rapier3d-compat';

await RAPIER.init();

console.log(RAPIER)


THREE.ColorManagement.legacyMode = false

camera.position.set(0, 2, 10)
camera.far = 5000

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

{
  const geometry = new THREE.BufferGeometry();
  const vec3 = new THREE.Vector3();

  const count = 10_000
  const radius = 200

  const vertices = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i += 3) {
    vec3.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize().multiplyScalar(radius)
    vertices[i + 0] = vec3.x
    vertices[i + 1] = vec3.y
    vertices[i + 2] = vec3.z
  }
  
  // itemSize = 3 because there are 3 values (components) per vertex
  geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
  geometry.translate(0, 0.5, 0)

  const material = new THREE.PointsMaterial()
  material.size = 0.5
  material.sizeAttenuation = true
  const points = new THREE.Points(geometry, material)
  scene.add(points)
}

// Add the floor
{
  const geometry = new THREE.BoxGeometry(10, 0.1, 10)
  const material = new THREE.MeshPhysicalMaterial({ color: 'lightslategrey' })
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

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial()
)

cube.castShadow = true
cube.receiveShadow = true

scene.add(cube)

let world = new RAPIER.World({ x: 0.0, y: -9.81, z: 0.0 });

// Add floor
let floorDesc = new RAPIER.RigidBodyDesc(RAPIER.RigidBodyType.Fixed).setCanSleep(false)

// All done, actually build the rigid-body.
let floorRigidBody = world.createRigidBody(floorDesc);
let floorCollider = world.createCollider(RAPIER.ColliderDesc.cuboid(5, 0.05, 5), floorRigidBody);

// Add cube
let rigidBodyDesc = new RAPIER.RigidBodyDesc(RAPIER.RigidBodyType.Dynamic).setCanSleep(false)

const cuboid = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5);

// All done, actually build the rigid-body.
let rigidBody = world.createRigidBody(rigidBodyDesc);
rigidBody.setTranslation({ x: 0, y: 5, z: 0 });
rigidBody.setRotation({ x: 0.5, y: 0.5, z: 0.5, w: 1 })
let collider = world.createCollider(cuboid, rigidBody);

const material = new THREE.LineBasicMaterial({
  color: 0xffffff,
  vertexColors: true,
})

const geometry = new THREE.BufferGeometry()
const lines = new THREE.LineSegments(geometry, material)
lines.frustumCulled = false

scene.add(lines)

const updateDebugDrawer = (vertices: Float32Array, colors: Float32Array) => {
  lines.geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
  lines.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 4))
}

update(() => {
  world.step()
  const { colors, vertices } = world.debugRender()
  let position = rigidBody.translation();
  let rotation = rigidBody.rotation();

  console.log(floorRigidBody.translation())

  cube.position.set(position.x, position.y, position.z)
  cube.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w)

  updateDebugDrawer(vertices, colors)
})

new Inspector(THREE, scene, camera, renderer)

run()
