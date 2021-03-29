'use strict'

// Classe Tface
// Representa visualmente o face

//three
import * as THREE from 'three'
import { Object3D } from 'three/src/core/Object3D.js'
import { Vector3 } from 'three/src/math/Vector3';



	/**
	 * @param nome: string
   * @param arrTponto = []
   * @param arrFaces = []
	*/

class Tface extends Object3D {
  constructor( nome, arrTponto, arrFaces ) { //Parametros: string, Vector3(X,Y,Z)

		super();

		this.type = 'Tface';
    //name of face
    this.nome = nome;
    //receives  Tpontos array  
    this.arrPt = arrTponto;
    //receives array of points name that makes up the face
    this.arrFaces = arrFaces
    
  }
/* recebe o array de pontos e o array com o nomes dos pontos de cada face, compara ambos 
e separa os pontos de cada face determina a normal de cada face, cria a malha da mesma e adiciona na cena.
*/

  //intersect array of point names with Tponto array (vector3)
 criaFace(){
  
  this.points=[]
  this.furo=[]
  this.furar = false
  this.index

  //analisa se a face tem furo e se sim passa o index do furo para a variavel index
  this.arrFaces.forEach((elemento,index)=>{
    if(elemento == "-"){
      this.furar = true
      this.index= index
   }
  })

  //verifica se tem furo e separa o array da face em 2 arrays separados (pontos da face e furo)
  if (this.furar == true){
    for(var f = 0; f < this.index; f++){
      this.arrPt.forEach((e)=>{
        if(e.nome == this.arrFaces[f]){
        this.pontV = new THREE.Vector3(e.X,e.Y,e.Z)
         this.points.push(this.pontV)
     }
    })
    }
   for(var id = this.index + 1; id<this.arrFaces.length; id++){
    this.arrPt.forEach((e)=>{
      if(e.nome == this.arrFaces[id]){
      this.pontF = new THREE.Vector3(e.X,e.Y,e.Z)
       this.furo.push(this.pontF)
    }
  })}

  this.triangulo = new THREE.Triangle(this.points[2], this.points[1], this.points[0])
   this.normal = new THREE.Vector3();
   this.triangulo.getNormal(this.normal);
  
   this.baseNormal = new Vector3(0,0,1);
   //aplica a rotação da face baseada no quaternion de 2 vertices
   this.q = new THREE.Quaternion().setFromUnitVectors(this.normal, this.baseNormal);
   
 
   //aplica a normal aos pontos 
   this.tempPoints = [];
   this.points.forEach(p => {
   this.tempPoints.push(p.clone().applyQuaternion(this.q));
   })
 
   
   //generates the face mesh
   this.shapeFace = new THREE.Shape(this.tempPoints);

   this.trianguloF= new THREE.Triangle(this.furo[2], this.furo[1], this.furo[0])
   this.normalF = new THREE.Vector3();
   this.trianguloF.getNormal(this.normalF);
   this.baseNormalF = new Vector3(0,0,1);

   //aplica a rotação da face baseada no quaternion de 2 vertices
   this.qF = new THREE.Quaternion().setFromUnitVectors(this.normalF, this.baseNormalF);
   
 
   //aplica a normal aos pontos 
   this.tempFuro = [];
   this.furo.forEach(p => {
   this.tempFuro.push(p.clone().applyQuaternion(this.qF));
   })

   this.furoFace = new THREE.Shape(this.tempFuro)
    this.shapeFace.holes.push( this.furoFace );
     this.shapeGeom =  new THREE.ShapeGeometry(this.shapeFace);
    this.mesh = new THREE.Mesh(this.shapeGeom, new THREE.MeshBasicMaterial({
     color: 0xfcee2b,
      side: THREE.DoubleSide,
       transparent: true,
       opacity: .6,
       wireframe: false
     }));


    this.verticesCFuro = this.points
     this.furo.forEach(e=>{
       this.verticesCFuro.push(e)
     })

    this.mesh.geometry.vertices = this.verticesCFuro;
    this.name = String
    this.mesh.name

  //se não tem furo cria o array de pontos da face
   }else{  for (var i = 0; i < this.arrFaces.length; i++){
    this.arrPt.forEach((e)=>{
    if(e.nome == this.arrFaces[i]){
    this.pontV = new THREE.Vector3(e.X,e.Y,e.Z)
     this.points.push(this.pontV)
     this.criaMalha(this.points)
 }
})
}}

     
     //add face to the scene
 
    this.add(this.mesh);

    //cria as arestas do solido
    this.geom = new THREE.BufferGeometry().setFromPoints(this.points);
    this.matLines = new THREE.LineBasicMaterial({color: "black"});
    this.lines = new THREE.LineLoop(this.geom, this.matLines);
    this.lines.name = "line"+ String(this.name);
    this.add(this.lines);
  
    

   }
criaMalha(points){
   //determina as normais da face baseada em 3 vertices 
   this.triangulo = new THREE.Triangle(points[2], points[1], points[0])
   this.normal = new THREE.Vector3();
   this.triangulo.getNormal(this.normal);
  
   this.baseNormal = new Vector3(0,0,1);
   //aplica a rotação da face baseada no quaternion de 2 vertices
   this.q = new THREE.Quaternion().setFromUnitVectors(this.normal, this.baseNormal);
   
 
   //aplica a normal aos pontos 
   this.tempPoints = [];
   points.forEach(p => {
   this.tempPoints.push(p.clone().applyQuaternion(this.q));
   })
 
   //generates the face mesh
   this.shapeFace = new THREE.Shape(this.tempPoints);
   this.shapeGeom = new THREE.ShapeGeometry(this.shapeFace);
   this.mesh = new THREE.Mesh(this.shapeGeom, new THREE.MeshBasicMaterial({
    color: 0xfcee2b,
     side: THREE.DoubleSide,
      transparent: true,
      opacity: .6,
      wireframe: false
    }));
 
      this.mesh.geometry.vertices = points;
      this.name = String
      this.mesh.name
    return this.mesh
}

dispose() {//libera a memória
  this.children.forEach(element => {
    element.material.dispose();
    element.geometry.dispose();
  });
  this.children = [];
}
update( nome, pt ) {//atualiza o ponto: nome e posição
  this.nome = nome;
  this.children.forEach(element => {
    element.position.copy(pt);
  });
}}


export { Tface };