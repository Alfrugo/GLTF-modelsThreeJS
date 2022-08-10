import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MixOperation } from 'three'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()



/**
 * Models
 */

const gltfLoader = new GLTFLoader()

let mixer = null
let cameraGLTF = null
let controls = null

gltfLoader.load ('/models/AD/AD-logo.gltf', 
(gltf) => 
{
    mixer = new THREE.AnimationMixer(gltf.scene)
    const action = mixer.clipAction(gltf.animations[0])

    action.play()

    // console.log (gltf)
    scene.add(gltf.scene)
    cameraGLTF = gltf.cameras [ 0 ]
    scene.add(cameraGLTF)


    // cameraGLTF.scale.set (1,1,1)

    console.log ( gltf.scene )


    // Controls   When making orbit actrive make sure to take out the comment section in the Tic animation section
controls = new OrbitControls(cameraGLTF, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true
}
);


// console.log(cameraGLTF)

/**
 * Floor
 */
// const floor = new THREE.Mesh(
//     new THREE.PlaneGeometry(10, 10),
//     new THREE.MeshStandardMaterial({
//         color: '#444444',
//         metalness: 0,
//         roughness: 0.5
//     })
// )
// floor.receiveShadow = true
// floor.rotation.x = - Math.PI * 0.5
// scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 10)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 10)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}



/**
 * Camera
 */
// Base camera
// const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
// camera.position.set(2, 2, 4)
// scene.add(camera)



/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Mixer update animation for the AD logo
    if (mixer !== null){
        mixer.update(deltaTime)
        // console.log(mixer)
    }
        

    if (cameraGLTF !== null){
        // console.log (cameraGLTF)
        

        renderer.render(scene, cameraGLTF)
            // Update controls  donm't forget to un comment this part too when turning orbit controls on
    controls.update() 

    }



    // Render

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()