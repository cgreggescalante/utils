import {formatMilliseconds} from "@utils/shared/tools";

describe('formatMilliseconds', () =>
    test('formats milliseconds into hh:mm:ss.ss', () => {
        expect(formatMilliseconds(43932300)).toEqual('12:12:12.300');
        expect(formatMilliseconds(3661300)).toEqual('1:01:01.300');
        expect(formatMilliseconds(721001)).toEqual('12:01.001');
        expect(formatMilliseconds(1300)).toEqual('1.300');
        expect(formatMilliseconds(300)).toEqual('0.300');
    })
)