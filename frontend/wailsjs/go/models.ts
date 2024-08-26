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
	    id: string;
	    url: string;
	    spriteType: string;
	    fileName: string;
	    imageData: ImageData;
	
	    static createFrom(source: any = {}) {
	        return new Sprite(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.url = source["url"];
	        this.spriteType = source["spriteType"];
	        this.fileName = source["fileName"];
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
	export class SpriteData {
	    data: {[key: string]: Sprite[]};
	
	    static createFrom(source: any = {}) {
	        return new SpriteData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.data = source["data"];
	    }
	}
	export class SpriteGroup {
	    id: string;
	    sprites: Sprite[];
	
	    static createFrom(source: any = {}) {
	        return new SpriteGroup(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.sprites = this.convertValues(source["sprites"], Sprite);
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
	export class SpriteGroupData {
	    data: {[key: string]: SpriteGroup[]};
	
	    static createFrom(source: any = {}) {
	        return new SpriteGroupData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.data = source["data"];
	    }
	}

}

