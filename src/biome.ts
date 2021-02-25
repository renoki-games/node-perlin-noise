import { NoiseLimits } from './noise-limits';

export class Biome {
    /**
     * The list of biomes.
     *
     * @return {Object}
     */
    _biomes = {
        OCEAN: {
            name: 'OCEAN',
            rgb: [54, 62, 150],
        },
        SHALLOWS: {
            name: 'SHALLOWS',
            rgb: [88, 205, 237],
        },
        BEACH: {
            name: 'BEACH',
            rgb: [247, 247, 119],
        },
        SCORCHED: {
            name: 'SCORCHED',
            rgb: [247, 149, 119],
        },
        BARE: {
            name: 'BARE',
            rgb: [168, 166, 165],
        },
        TUNDRA: {
            name: 'TUNDRA',
            rgb: [132, 173, 158],
        },
        TEMPERATE_DESERT: {
            name: 'TEMPERATE_DESERT',
            rgb: [227, 155, 0],
        },
        SHRUBLAND: {
            name: 'SHRUBLAND',
            rgb: [62, 110, 58],
        },
        GRASSLAND: {
            name: 'GRASSLAND',
            rgb: [55, 181, 43],
        },
        TEMPERATE_DECIDUOUS_FOREST: {
            name: 'TEMPERATE_DECIDUOUS_FOREST',
            rgb: [62, 138, 55],
        },
        TEMPERATE_RAIN_FOREST: {
            name: 'TEMPERATE_RAIN_FOREST',
            rgb: [161, 38, 255],
        },
        SUBTROPICAL_DESERT: {
            name: 'SUBTROPICAL_DESERT',
            rgb: [255, 214, 153],
        },
        TROPICAL_SEASONAL_FOREST: {
            name: 'TROPICAL_SEASONAL_FOREST',
            rgb: [102, 153, 0],
        },
        TROPICAL_RAIN_FOREST: {
            name: 'TROPICAL_RAIN_FOREST',
            rgb: [255, 0, 119],
        },
        SNOW: {
            name: 'SNOW',
            rgb: [255, 255, 255],
        },
        TAIGA: {
            name: 'TAIGA',
            rgb: [62, 87, 71],
        },
        SWAMP: {
            name: 'SWAMP',
            rgb: [92, 112, 104],
        },
        VOID: {
            name: 'VOID',
            rgb: [0, 0, 0],
        },
    };

    /**
     * Initialize the biome class.
     *
     * @param {NoiseLimits}  noiseLimits
     */
    constructor(protected noiseLimits: NoiseLimits) {
        //
    }

    /**
     * Get biome by elevation and moisture levels.
     *
     * @param  {number}  elevation
     * @param  {number}  moisture
     * @return {Object}
     */
    getBiome(elevation: number, moisture: number): { name: string; rgb: number[] } {
        /**
         * Water + Shore
         */
        if (elevation <= this.noiseLimits.water) {
            return this._biomes.OCEAN;
        } else if (elevation <= this.noiseLimits.sand && moisture >= 0.2) {
            return this._biomes.SWAMP;
        } else if (elevation <= this.noiseLimits.shore) {
            return this._biomes.SHALLOWS;
        } else if (elevation <= this.noiseLimits.sand) {
            return this._biomes.BEACH;
        }

        /**
         * Peak Mountain
         */
        if (elevation > this.noiseLimits.peak) {
            if (moisture < 0.1) {
                return this._biomes.SCORCHED;
            } else if (moisture < 0.2) {
                return this._biomes.BARE;
            } else if (moisture < 0.5) {
                return this._biomes.TUNDRA;
            } else {
                return this._biomes.SNOW;
            }
        }

        /**
         * Mountains
         */
        if (elevation > this.noiseLimits.mountain) {
            if (moisture < 0.33) {
                return this._biomes.TEMPERATE_DESERT;
            } else if (moisture < 0.66) {
                return this._biomes.SHRUBLAND;
            } else {
                return this._biomes.TAIGA;
            }
        }

        /**
         * Land
         */
        if (moisture < 0.16) {
            return this._biomes.SUBTROPICAL_DESERT;
        } else if (moisture < 0.33) {
            return this._biomes.GRASSLAND;
        } else if (moisture < 0.66) {
            return this._biomes.TROPICAL_SEASONAL_FOREST;
        } else {
            return this._biomes.TROPICAL_RAIN_FOREST;
        }
    }

    /**
     * Get the biome color in RGB array
     * by giving the elevation and moisture.
     *
     * @param  {number}  elevation
     * @param  {number}  moisture
     * @return {number[]}
     */
    getBiomeColor(elevation: number, moisture: number): number[] {
        let { rgb } = this.getBiome(elevation, moisture);

        return rgb;
    }

    /**
     * Get the biome name in RGB array
     * by giving the elevation and moisture.
     *
     * @param  {number}  elevation
     * @param  {number}  moisture
     * @return {string}
     */
    getBiomeName(elevation: number, moisture: number): string {
        let { name } = this.getBiome(elevation, moisture);

        return name;
    }
}
