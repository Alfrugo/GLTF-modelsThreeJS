import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { CubeCamera, MixOperation } from 'three'

import { TextureLoader } from 'three'

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
let camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
let childCamera = null

gltfLoader.load ('/models/AD/AD-logo.gltf', 
    (gltf) => 
    {   
        gltf.scene.traverse((child) =>
            {
                // console.log(child.children[0].position)
                child.material = bakedMaterial

            })
        // animation of the elements in the scene
        mixer = new THREE.AnimationMixer(gltf.scene)
        const actionCamera = mixer.clipAction(gltf.animations[2])
        const actionAD = mixer.clipAction(gltf.animations[0])
        
        actionCamera.play()
        actionAD.play()
        

        scene.add(gltf.scene)
        // cameraGLTF = gltf.cameras [ 0 ]
        // scene.add(cameraGLTF)
        // cameraGLTF.scale.set (1,1,1)

     
        // camera.position.set(-3, 0.5, 5)
        scene.add(camera)
        
        // console.log(gltf.scene.children.PerspectiveCamera)

        const tick = () =>
        {
            const elapsedTime = clock.getElapsedTime()
            const deltaTime = elapsedTime - previousTime
            previousTime = elapsedTime
        
            // Mixer update animation for the AD logo
            if (mixer !== null){
                mixer.update(deltaTime)
            }
            // console.log(gltf.scene.children[0].position.x)

            // if (cameraGLTF !== null){
            //     // console.log (cameraGLTF)
            //     renderer.render(scene, cameraGLTF)
            //         // Update controls  donm't forget to un comment this part too when turning orbit controls on
            //     controls.update() 
            // }

            renderer.render(scene, camera)
            camera.position.set(gltf.scene.children[0].position.x, gltf.scene.children[0].position.y, gltf.scene.children[0].position.z)
            // camera.lookAt(gltf.scene.children[1])
        
            
        

            //         // Update controls  donm't forget to un comment this part too when turning orbit controls on
            // controls.update() 
            window.requestAnimationFrame(tick)
        
            
        
        }
        
        tick()



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
// const ambientLight = new THREE.AmbientLight(0xffffff, 10)
// scene.add(ambientLight)

// const directionalLight = new THREE.DirectionalLight(0xffffff, 10)
// directionalLight.castShadow = true
// directionalLight.shadow.mapSize.set(1024, 1024)
// directionalLight.shadow.camera.far = 15
// directionalLight.shadow.camera.left = - 7
// directionalLight.shadow.camera.top = 7
// directionalLight.shadow.camera.right = 7
// directionalLight.shadow.camera.bottom = - 7
// directionalLight.position.set(5, 5, 5)
// scene.add(directionalLight)



/**
 * Texture loader
 */
const textureLoader = new THREE.TextureLoader()

/**
 * Textures
 */
const bakedTexture = textureLoader.load('/models/AD/AD-Backed.jpg')
bakedTexture.flipY = false

/**
 * Materials
 */

// Baked material
const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture })




 // Controls   When making orbit actrive make sure to take out the comment section in the Tic animation section
//  controls = new OrbitControls(camera, canvas)
//  controls.target.set(0, 0.75, 0)
//  controls.enableDamping = true

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

