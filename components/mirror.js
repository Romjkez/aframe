AFRAME.registerComponent('mirror', {
    schema: {
        resolution: { type:'number', default: 128},
        refraction: { type:'number', default: 0.95},
        color: {type:'color', default: 0xffffff},
        distance: {type:'number', default: 3000},
        interval: { type:'number', default: 1000},
        repeat: { type:'boolean', default: false}
    },

    multiple: false,

    init: function(){
        this.counter = this.data.interval;

        this.cam = new THREE.CubeCamera( 0.5, this.data.distance, this.data.resolution);
        this.el.object3D.add( this.cam );
        this.mirrorMaterial = new THREE.MeshBasicMaterial( { color: this.data.color, refractionRatio: this.data.refraction, envMap: this.cam.renderTarget.texture } );
        this.done = false;
        var mirrormat = this.mirrorMaterial;
        this.mesh = this.el.getObject3D('mesh');
        if(this.mesh){
            this.mesh.traverse( function( child ) {
                if ( child instanceof THREE.Mesh ) child.material = mirrormat;
            });
        }
    },

    tick: function(t,dt){
        if(!this.done){
            if( this.counter > 0){
                this.counter-=dt;
            }else{
                this.mesh = this.el.getObject3D('mesh');

                if(this.mesh){
                    this.mesh.visible = false;
                    AFRAME.scenes[0].renderer.autoClear = true;
                    this.cam.position.copy(this.el.object3D.worldToLocal(this.el.object3D.getWorldPosition()));
                    this.cam.updateCubeMap( AFRAME.scenes[0].renderer, this.el.sceneEl.object3D );

                    var mirrormat = this.mirrorMaterial;
                    this.mesh.traverse( function( child ) {
                        if ( child instanceof THREE.Mesh ) child.material = mirrormat;
                    });
                    this.mesh.visible = true;

                    if(!this.data.repeat){
                        this.done = true;
                        this.counter = this.data.interval;
                    }
                }
            }
        }
    },

    update: function (oldData) {},

    remove: function () {},

    pause: function () { },

    play: function () { }
});
