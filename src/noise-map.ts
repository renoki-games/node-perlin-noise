import { Biome } from './biome';
import { MoistureMap } from './moisture-map';
import { NoiseLimits } from './noise-limits';
import { Simplex } from '@renoki-games/node-simplex';

export class NoiseMap {
    /**
     * The generated tiles with their
     * noise levels and the generated biome.
     *
     * @type {any[]}
     */
    public _tiles: any[] = [];

    /**
     * The moisture map for the terrain noise.
     * Will be used to determine the atmospheric moisture
     * so that biomes can be generated between terrain and
     * the moisture levels. generated by this noise.
     *
     * @type {MoistureMap}
     */
    public _moistureMap;

    /**
     * The biome object.
     *
     * @type {Biome}
     */
    protected _biome;

    /**
     * Initializse the noise map.
     *
     * @param  {number}  width
     * @param  {number}  height
     * @param  {number}  offsetX
     * @param  {number}  offsetY
     * @param  {NoiseLimits}  noiseLimits
     * @param  {string}  algorithm
     * @param  {number}  scale
     * @param  {number}  octaves
     * @param  {number}  persistence
     * @param  {number}  lacunarity
     */
    constructor(
        public width: number,
        public height: number,
        public offsetX: number = 0.0,
        public offsetY: number = 0.0,
        public noiseLimits: NoiseLimits = {
            water: -0.72,
            shore: -0.44,
            sand: -0.44,
            land: 0.12,
            mountain: 0.44,
            peak: 0.72,
        },
        public algorithm: string = 'simplex',
        public scale: number = 200.0,
        public octaves: number = 8.0,
        public persistence: number = 0.5,
        public lacunarity: number = 3.0,
    ) {
        this._biome = new Biome(noiseLimits);
    }

    /**
     * Generate a moisture map instead of providing one.
     *
     * @param  {number}  noiseLimits
     * @param  {number}  algorithm
     * @param  {number}  scale
     * @param  {number}  octaves
     * @param  {number}  persistence
     * @param  {number}  lacunarity
     * @return {this}
     */
    withMoistureMap(
        noiseLimits: NoiseLimits = {
            water: -0.72,
            shore: -0.44,
            sand: -0.44,
            land: 0.12,
            mountain: 0.44,
            peak: 0.72,
        },
        algorithm = 'simplex',
        scale = 200.0,
        octaves = 8.0,
        persistence = 0.5,
        lacunarity = 3.0,
    ): this {
        return this.addMoistureMap(new MoistureMap(
            this.width,
            this.height,
            this.offsetX,
            this.offsetY,
            noiseLimits,
            algorithm,
            scale,
            octaves,
            persistence,
            lacunarity,
        ));
    }

    /**
     * Import the Moisture Map into the terrain map.
     *
     * @param  {MoistureMap}  moistureMap
     * @return {this}
     */
    addMoistureMap(moistureMap: MoistureMap): this {
        // Generate the noise for the imported MoistureMap.
        this._moistureMap = moistureMap.generate();

        // For each existing tile in the current terrain map, combine the
        // tile noise value with the moisture noise value to get a biome.
        this._tiles.forEach((tile, tileIndex) => {
            let moisture = this._moistureMap.tiles[tileIndex];

            this._tiles[tileIndex] = {
                ...this._tiles[tileIndex],
                ...{
                    moistureValue: moisture.noiseValue,
                    biome: this._biome.getBiomeName(tile.noiseValue, moisture.noiseValue),
                },
            };
        });

        return this;
    }

    /**
     * Generate the noises and put them into tiles.
     *
     * @return {this}
     */
    generate(): this {
        for (let y = 0; y < this.height; y++) {
            let row = [];

            for (let x = 0; x < this.width; x++) {
                row.push({
                    noiseValue: this.getNoiseValue(x, y),
                });
            }

            this._tiles.push(row);
        }

        return this;
    }

    /**
     * Turn the noise map into Object.
     *
     * @return {Object}
     */
    toObject(): Object {
        return {
            width: this.width,
            height: this.height,
            algorithm: this.algorithm,
            scale: this.scale,
            octaves: this.octaves,
            limits: this.noiseLimits,
            offsets: {
                x: this.offsetX,
                y: this.offsetY,
            },
            biomes: this._biome._biomes,
            tiles: this._tiles,
        };
    }

    /**
     * Turn the noise map into a JSON string.
     *
     * @return string
     */
    toJson(): string {
        return JSON.stringify(this.toObject());
    }

    /**
     * Get a noise value between -1 and 1, for a given
     * coordinates (X, Y). The scale & offsets are
     * automatically applied.
     *
     * @param  {number}  x
     * @param  {number}  y
     * @return {number}
     */
    protected getNoiseValue(x: number, y: number): number {
        if (this.algorithm === 'simplex') {
            return new Simplex({
                frequency: this.lacunarity,
                min: -1,
                max: 1,
                octaves: this.octaves,
                persistence: this.persistence,
            }).raw2D(
                (x + this.offsetX) * this.scale,
                (y + this.offsetY) * this.scale
            );
        }
    }
}
