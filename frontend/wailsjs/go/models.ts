export namespace main {
	
	export class ImageData {
	    hue: number;
	    saturation: number;
	
	    static createFrom(source: any = {}) {
	        return new ImageData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.hue = source["hue"];
	        this.saturation = source["saturation"];
	    }
	}
	export class Sprite {
	    origPath: string;
	    spriteType: string;
	    imageData: ImageData;
	
	    static createFrom(source: any = {}) {
	        return new Sprite(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.origPath = source["origPath"];
	        this.spriteType = source["spriteType"];
	        this.imageData = this.convertValues(source["imageData"], ImageData);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Dir {
	    path: string;
	    sprites: Sprite[];
	    dirs: Dir[];
	
	    static createFrom(source: any = {}) {
	        return new Dir(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.path = source["path"];
	        this.sprites = this.convertValues(source["sprites"], Sprite);
	        this.dirs = this.convertValues(source["dirs"], Dir);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	
	export class Tree {
	    spriteType: string;
	    path: string;
	    spritesMap: {[key: string]: Sprite[]};
	    children: {[key: string]: Tree};
	
	    static createFrom(source: any = {}) {
	        return new Tree(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.spriteType = source["spriteType"];
	        this.path = source["path"];
	        this.spritesMap = source["spritesMap"];
	        this.children = this.convertValues(source["children"], Tree, true);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

