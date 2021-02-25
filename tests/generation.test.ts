import { NoiseMap } from './../src/index';

describe('generation', () => {
    test('simple generation', () => {
        let noiseMap = new NoiseMap(2, 2);

        noiseMap.withMoistureMap().generate();

        console.log(noiseMap.toJson());
    });
});
