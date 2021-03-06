var grass = function( exports ) {


    var group, material;
    exports.init = function( scene, ground, rocks ){

        group = new THREE.Object3D();
        exports.group = group;
        scene.add( group );

        /*
        var mesh = new THREE.Mesh( geometries.grass, materials.grass );

        //recentre le mesh des plantes
        var geom = geometries.grass;
        geom.computeBoundingBox();

        //center est me centre de la bounding box
        var bbox = geom.boundingBox;
        var center = bbox.min.add( bbox.max.clone().sub( bbox.min ).multiplyScalar( .5 ) );

        //si on soustrait le centre de la bounding box, ça recentre le mesh
        mesh.position.sub( center );

        //et on le décale en hauteur pour qu'il soit posé sur le sol
        mesh.position.y += ( bbox.max.y - bbox.min.y );
        group.add( mesh );
        //*/

        centerGeometry( geometries.grass, .1 );

        var scale = new THREE.Vector2( .35,1.1 );
        distributeObjects( ground, 200, scale );


    };


    function centerGeometry( geom, scale ){

        //recentre le mesh des plantes
        geom.computeBoundingBox();
        var bbox = geom.boundingBox;

        //center est lme centre de la bounding box
        var center = bbox.min.add( bbox.max.clone().sub( bbox.min ).multiplyScalar( .5 ) );
        var height = ( bbox.max.y - bbox.min.y );

        //itère sur chaque entrée des vertices
        var attr = geom.getAttribute( "position" );

        for( var i =0; i < attr.array.length; i += 3 ){

            //repositionne
            attr.array[ i ] -= center.x;

            attr.array[ i + 1 ] -= center.y;
                attr.array[ i + 1 ] += height;

            attr.array[ i + 2 ] -= center.z;

            //re scale
            attr.array[i] *= scale;
            attr.array[i+1] *= scale;
            attr.array[i+2] *= scale;

        }

    }

    function distributeObjects( ground, count, scale ){

        var center = new THREE.Vector3(0,ground.radius * ground.height,0);
        var earthCenter = new THREE.Vector3(0,-ground.radius * 10,0);

        for( var i = 0; i < count; i++ ){

            var mesh = new THREE.Mesh( geometries.grass, materials.grass );
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            var lat = ( Math.sqrt( Math.random() ) )* Math.PI / 2;
            var lon = Math.random() * Math.PI * 2;

            mesh.position.set( Math.sin( lat ) * Math.sin( lon ),
                            Math.cos( lat ) * ground.height,
                            Math.sin( lat ) * Math.cos( lon ) ).multiplyScalar( ground.radius ).sub( center );

            mesh.lookAt( earthCenter );
            mesh.rotateX( - Math.PI / 2 );
            mesh.scale.multiplyScalar( lerp( Math.random(), scale.x, scale.y ) );
            group.add( mesh );

        }
    }


    //animation
    var raf;
    exports.stop = function(){ cancelAnimationFrame(raf); };
    exports.start = function(){ exports.stop(); update(); };
    function update(){
        raf = requestAnimationFrame(update);
        material.uniforms.time.value = Math.sin( Date.now() * 0.001 );
    }

    return exports;

}({});