import type { DataURL } from '../src';

import { describe, it, expect } from 'vitest';

import { parse, validate } from '../src';

describe('parse', () => {
  it('return false when invalid data url', () => {
    expect(parse('data:HelloWorld')).toBe(false);
  });

  it('parse data', () => {
    const parsed = parse('data:,Hello World!') as DataURL;

    expect(parsed).toStrictEqual({
      base64: false,
      data: 'Hello World!',
      toBuffer: expect.any(Function),
    });
  });

  it('parse data with trailing spaces', () => {
    const parsed = parse(' data:,Hello World! ') as DataURL;

    expect(parsed).toStrictEqual({
      base64: false,
      data: 'Hello World!',
      toBuffer: expect.any(Function),
    });
  });

  it('parse data with media type', () => {
    const parsed = parse('data:text/html,%3Ch1%3EHello%2C%20World!%3C%2Fh1%3E') as DataURL;

    expect(parsed).toStrictEqual({
      mediaType: 'text/html',
      contentType: 'text/html',
      base64: false,
      data: '%3Ch1%3EHello%2C%20World!%3C%2Fh1%3E',
      toBuffer: expect.any(Function),
    });
  });

  it('parse with empty data', () => {
    const parsed = parse('data:,') as DataURL;

    expect(parsed).toStrictEqual({
      base64: false,
      data: '',
      toBuffer: expect.any(Function),
    });
  });

  it('parse base64 encoded data with simple media type', () => {
    const parsed = parse('data:text/plain;base64,SGVsbG8sIFdvcmxkIQ%3D%3D') as DataURL;

    expect(parsed).toStrictEqual({
      mediaType: 'text/plain',
      contentType: 'text/plain',
      base64: true,
      data: 'SGVsbG8sIFdvcmxkIQ%3D%3D',
      toBuffer: expect.any(Function),
    });
  });

  it('parse base64 encoded data with complex media type', () => {
    const parsed = parse(
      'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCBmaWxsPSIjMDBCMUZGIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIvPjwvc3ZnPg==',
    ) as DataURL;

    expect(parsed).toStrictEqual({
      mediaType: 'image/svg+xml',
      contentType: 'image/svg+xml',
      base64: true,
      data: 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCBmaWxsPSIjMDBCMUZGIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIvPjwvc3ZnPg==',
      toBuffer: expect.any(Function),
    });
  });

  it('parse data with media types that contain .', () => {
    const parsed = parse('data:application/vnd.ms-excel;base64,PGh0bWw%2BPC9odG1sPg%3D%3D') as DataURL;

    expect(parsed).toStrictEqual({
      mediaType: 'application/vnd.ms-excel',
      contentType: 'application/vnd.ms-excel',
      base64: true,
      data: 'PGh0bWw%2BPC9odG1sPg%3D%3D',
      toBuffer: expect.any(Function),
    });
  });

  it('parse data with complex media type and single attribute', () => {
    const parsed = parse(
      'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%22%20height%3D%22100%22%3E%3Crect%20fill%3D%22%2300B1FF%22%20width%3D%22100%22%20height%3D%22100%22%2F%3E%3C%2Fsvg%3E',
    ) as DataURL;

    expect(parsed).toStrictEqual({
      mediaType: 'image/svg+xml;charset=utf-8',
      contentType: 'image/svg+xml',
      charset: 'utf-8',
      base64: false,
      data: '%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%22%20height%3D%22100%22%3E%3Crect%20fill%3D%22%2300B1FF%22%20width%3D%22100%22%20height%3D%22100%22%2F%3E%3C%2Fsvg%3E',
      toBuffer: expect.any(Function),
    });
  });

  it('parse data with media type and multiple attributes', () => {
    const parsed = parse(
      'data:image/png;name=foo.bar;baz=quux;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIBAMAAAA2IaO4AAAAFVBMVEXk5OTn5+ft7e319fX29vb5+fn///++GUmVAAAALUlEQVQIHWNICnYLZnALTgpmMGYIFWYIZTA2ZFAzTTFlSDFVMwVyQhmAwsYMAKDaBy0axX/iAAAAAElFTkSuQmCC',
    ) as DataURL;

    expect(parsed).toStrictEqual({
      mediaType: 'image/png;name=foo.bar;baz=quux',
      contentType: 'image/png',
      name: 'foo.bar',
      baz: 'quux',
      base64: true,
      data: 'iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIBAMAAAA2IaO4AAAAFVBMVEXk5OTn5+ft7e319fX29vb5+fn///++GUmVAAAALUlEQVQIHWNICnYLZnALTgpmMGYIFWYIZTA2ZFAzTTFlSDFVMwVyQhmAwsYMAKDaBy0axX/iAAAAAElFTkSuQmCC',
      toBuffer: expect.any(Function),
    });
  });

  it('should retain casing of `name` attributes', () => {
    const parsed = parse('data:text/plain;name=LoREM_IpSuM.txt;base64,TG9yZW0gaXBzdW0gZG9sb3Igc2l0IG1ldA==') as DataURL;

    expect(parsed).toStrictEqual({
      mediaType: 'text/plain;name=lorem_ipsum.txt',
      contentType: 'text/plain',
      name: 'LoREM_IpSuM.txt',
      base64: true,
      data: 'TG9yZW0gaXBzdW0gZG9sb3Igc2l0IG1ldA==',
      toBuffer: expect.any(Function),
    });
  });

  it('export buffer from parsed data with base64', () => {
    const parsed = parse('data:text/plain;base64,SGVsbG8sIFdvcmxkIQ%3D%3D') as DataURL;
    const buffer = Buffer.from(parsed.data, 'base64');
    const parsedBuffer = parsed.toBuffer();
    expect(buffer.equals(parsedBuffer)).toBe(true);
  });

  it('export buffer from parsed data with utf-8', () => {
    const parsed = parse('data:text/html,%3Ch1%3EHello%2C%20World!%3C%2Fh1%3E') as DataURL;
    const buffer = Buffer.from(parsed.data, 'utf8');
    const parsedBuffer = parsed.toBuffer();
    expect(buffer.equals(parsedBuffer)).toBe(true);
  });

  it('export buffer from parsed data with empty data', () => {
    const parsed = parse('data:,') as DataURL;
    const buffer = Buffer.from(parsed.data, 'utf8');
    const parsedBuffer = parsed.toBuffer();
    expect(buffer.equals(parsedBuffer)).toBe(true);
  });
});

describe('validate', () => {
  describe('should pass on valid data URLs', () => {
    it.each([
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAAD///+l2Z/dAAAAM0lEQVR4nGP4/5/h/1+G/58ZDrAz3D/McH8yw83NDDeNGe4Ug9C9zwz3gVLMDA/A6P9/AFGGFyjOXZtQAAAAAElFTkSuQmCC',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIBAMAAAA2IaO4AAAAFVBMVEXk5OTn5+ft7e319fX29vb5+fn///++GUmVAAAALUlEQVQIHWNICnYLZnALTgpmMGYIFWYIZTA2ZFAzTTFlSDFVMwVyQhmAwsYMAKDaBy0axX/iAAAAAElFTkSuQmCC',
      '   data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIBAMAAAA2IaO4AAAAFVBMVEXk5OTn5+ft7e319fX29vb5+fn///++GUmVAAAALUlEQVQIHWNICnYLZnALTgpmMGYIFWYIZTA2ZFAzTTFlSDFVMwVyQhmAwsYMAKDaBy0axX/iAAAAAElFTkSuQmCC   ',
      'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%22%20height%3D%22100%22%3E%3Crect%20fill%3D%22%2300B1FF%22%20width%3D%22100%22%20height%3D%22100%22%2F%3E%3C%2Fsvg%3E',
      'data:image/svg+xml;charset=utf-8;name=bar.svg,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%22%20height%3D%22100%22%3E%3Crect%20fill%3D%22%2300B1FF%22%20width%3D%22100%22%20height%3D%22100%22%2F%3E%3C%2Fsvg%3E',
      'data:image/png;name=foo.png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIBAMAAAA2IaO4AAAAFVBMVEXk5OTn5+ft7e319fX29vb5+fn///++GUmVAAAALUlEQVQIHWNICnYLZnALTgpmMGYIFWYIZTA2ZFAzTTFlSDFVMwVyQhmAwsYMAKDaBy0axX/iAAAAAElFTkSuQmCC',
      'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCBmaWxsPSIjMDBCMUZGIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIvPjwvc3ZnPg==',
      ' data:,Hello%2C%20World!',
      ' data:,Hello World!',
      ' data:text/plain;base64,SGVsbG8sIFdvcmxkIQ%3D%3D',
      ' data:text/html,%3Ch1%3EHello%2C%20World!%3C%2Fh1%3E',
      'data:,A%20brief%20note',
      'data:text/html;charset=US-ASCII,%3Ch1%3EHello!%3C%2Fh1%3E',
      'data:audio/mp3;base64,%3Ch1%3EHello!%3C%2Fh1%3E',
      'data:video/x-ms-wmv;base64,%3Ch1%3EHello!%3C%2Fh1%3E',
      'data:application/vnd.ms-excel;base64,PGh0bWw%2BPC9odG1sPg%3D%3D',
      'data:image/svg+xml;name=foobar%20(1).svg;charset=UTF-8,some-data',
      'data:image/svg+xml;name=lorem_ipsum.txt;charset=UTF-8,some-data',
      "data:text/html,<script>alert('hi');</script>",
    ])('%s', value => {
      expect(validate(value)).toBe(true);
    });
  });

  it.each([
    'dataxbase64',
    'data:HelloWorld',
    'data:text/html;charset=,%3Ch1%3EHello!%3C%2Fh1%3E',
    'data:text/plain;name=@;base64,SGVsbG8sIFdvcmxkIQ%3D%3D',
    'data:text/html;charset,%3Ch1%3EHello!%3C%2Fh1%3E',
    'data:base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAAD///+l2Z/dAAAAM0lEQVR4nGP4/5/h/1+G/58ZDrAz3D/McH8yw83NDDeNGe4Ug9C9zwz3gVLMDA/A6P9/AFGGFyjOXZtQAAAAAElFTkSuQmCC',
    '',
    'http://wikipedia.org',
    'base64',
    'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAAD///+l2Z/dAAAAM0lEQVR4nGP4/5/h/1+G/58ZDrAz3D/McH8yw83NDDeNGe4Ug9C9zwz3gVLMDA/A6P9/AFGGFyjOXZtQAAAAAElFTkSuQmCC',
  ])('%s', value => {
    expect(validate(value)).toBe(false);
  });
});
