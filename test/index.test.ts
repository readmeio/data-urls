import type { DataURL } from '../src';
import { expect } from 'chai';
import { parse, validate } from '../src';

describe('parse', function () {
  it('return false when invalid data url', () => {
    expect(parse('data:HelloWorld')).to.equal(false);
  });

  it('parse data', () => {
    const parsed = parse('data:,Hello World!') as DataURL;

    expect(parsed).to.be.an('object');
    expect(parsed.mediaType).be.an('undefined');
    expect(parsed.contentType).be.an('undefined');
    expect(parsed.base64).equal(false);
    expect(parsed.charset).be.an('undefined');
    expect(parsed.data).to.equal('Hello World!');
  });

  it('parse data with trailing spaces', () => {
    const parsed = parse(' data:,Hello World! ') as DataURL;

    expect(parsed).to.be.an('object');
    expect(parsed.mediaType).be.an('undefined');
    expect(parsed.contentType).be.an('undefined');
    expect(parsed.base64).equal(false);
    expect(parsed.charset).be.an('undefined');
    expect(parsed.data).to.equal('Hello World!');
  });

  it('parse data with media type', () => {
    const parsed = parse('data:text/html,%3Ch1%3EHello%2C%20World!%3C%2Fh1%3E') as DataURL;

    expect(parsed).to.be.an('object');
    expect(parsed.mediaType).to.equal('text/html');
    expect(parsed.contentType).to.equal('text/html');
    expect(parsed.base64).equal(false);
    expect(parsed.charset).be.an('undefined');
    expect(parsed.data).to.equal('%3Ch1%3EHello%2C%20World!%3C%2Fh1%3E');
  });

  it('parse with empty data ', () => {
    const parsed = parse('data:,') as DataURL;

    expect(parsed).to.be.an('object');
    expect(parsed.mediaType).be.an('undefined');
    expect(parsed.contentType).be.an('undefined');
    expect(parsed.base64).equal(false);
    expect(parsed.charset).be.an('undefined');
    expect(parsed.data).to.equal('');
  });

  it('parse base64 encoded data with simple media type', () => {
    const parsed = parse('data:text/plain;base64,SGVsbG8sIFdvcmxkIQ%3D%3D') as DataURL;

    expect(parsed).to.be.an('object');
    expect(parsed.mediaType).to.equal('text/plain');
    expect(parsed.contentType).to.equal('text/plain');
    expect(parsed.base64).equal(true);
    expect(parsed.charset).be.an('undefined');
    expect(parsed.data).to.equal('SGVsbG8sIFdvcmxkIQ%3D%3D');
  });

  it('parse base64 encoded data with complex media type', () => {
    const parsed = parse(
      'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCBmaWxsPSIjMDBCMUZGIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIvPjwvc3ZnPg=='
    ) as DataURL;

    expect(parsed).to.be.an('object');
    expect(parsed.mediaType).to.equal('image/svg+xml');
    expect(parsed.contentType).to.equal('image/svg+xml');
    expect(parsed.base64).equal(true);
    expect(parsed.charset).be.an('undefined');
    expect(parsed.data).to.equal(
      'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCBmaWxsPSIjMDBCMUZGIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIvPjwvc3ZnPg=='
    );
  });

  it('parse data with media types that contain .', () => {
    const parsed = parse('data:application/vnd.ms-excel;base64,PGh0bWw%2BPC9odG1sPg%3D%3D') as DataURL;

    expect(parsed).to.be.an('object');
    expect(parsed.mediaType).to.equal('application/vnd.ms-excel');
    expect(parsed.contentType).to.equal('application/vnd.ms-excel');
    expect(parsed.base64).equal(true);
    expect(parsed.charset).be.an('undefined');
    expect(parsed.data).to.equal('PGh0bWw%2BPC9odG1sPg%3D%3D');
  });

  it('parse data with complex media type and single attribute', () => {
    const parsed = parse(
      'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%22%20height%3D%22100%22%3E%3Crect%20fill%3D%22%2300B1FF%22%20width%3D%22100%22%20height%3D%22100%22%2F%3E%3C%2Fsvg%3E'
    ) as DataURL;

    expect(parsed).to.be.an('object');
    expect(parsed.mediaType).to.equal('image/svg+xml;charset=utf-8');
    expect(parsed.contentType).to.equal('image/svg+xml');
    expect(parsed.charset).to.equal('utf-8');
    expect(parsed.base64).equal(false);
    expect(parsed.data).to.equal(
      '%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%22%20height%3D%22100%22%3E%3Crect%20fill%3D%22%2300B1FF%22%20width%3D%22100%22%20height%3D%22100%22%2F%3E%3C%2Fsvg%3E'
    );
  });

  it('parse data with media type and multiple attributes', () => {
    const parsed = parse(
      'data:image/png;name=foo.bar;baz=quux;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIBAMAAAA2IaO4AAAAFVBMVEXk5OTn5+ft7e319fX29vb5+fn///++GUmVAAAALUlEQVQIHWNICnYLZnALTgpmMGYIFWYIZTA2ZFAzTTFlSDFVMwVyQhmAwsYMAKDaBy0axX/iAAAAAElFTkSuQmCC'
    ) as DataURL;

    expect(parsed).to.be.an('object');
    expect(parsed.mediaType).to.equal('image/png;name=foo.bar;baz=quux');
    expect(parsed.contentType).to.equal('image/png');
    expect(parsed.name).to.equal('foo.bar');
    expect(parsed.baz).to.equal('quux');
    expect(parsed.base64).equal(true);
    expect(parsed.data).to.equal(
      'iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIBAMAAAA2IaO4AAAAFVBMVEXk5OTn5+ft7e319fX29vb5+fn///++GUmVAAAALUlEQVQIHWNICnYLZnALTgpmMGYIFWYIZTA2ZFAzTTFlSDFVMwVyQhmAwsYMAKDaBy0axX/iAAAAAElFTkSuQmCC'
    );
  });

  it('should retain casing of `name` attributes', () => {
    const parsed = parse('data:text/plain;name=LoREM_IpSuM.txt;base64,TG9yZW0gaXBzdW0gZG9sb3Igc2l0IG1ldA==') as DataURL;

    expect(parsed).to.be.an('object');
    expect(parsed.mediaType).to.equal('text/plain;name=lorem_ipsum.txt');
    expect(parsed.contentType).to.equal('text/plain');
    expect(parsed.name).to.equal('LoREM_IpSuM.txt');
    expect(parsed.base64).equal(true);
    expect(parsed.data).to.equal('TG9yZW0gaXBzdW0gZG9sb3Igc2l0IG1ldA==');
  });

  it('export buffer from parsed data with base64', () => {
    const parsed = parse('data:text/plain;base64,SGVsbG8sIFdvcmxkIQ%3D%3D') as DataURL;
    const buffer = Buffer.from(parsed.data, 'base64');
    const parsedBuffer = parsed.toBuffer();
    expect(buffer.equals(parsedBuffer)).equal(true);
  });

  it('export buffer from parsed data with utf-8', () => {
    const parsed = parse('data:text/html,%3Ch1%3EHello%2C%20World!%3C%2Fh1%3E') as DataURL;
    const buffer = Buffer.from(parsed.data, 'utf8');
    const parsedBuffer = parsed.toBuffer();
    expect(buffer.equals(parsedBuffer)).equal(true);
  });

  it('export buffer from parsed data with empty data', () => {
    const parsed = parse('data:,') as DataURL;
    const buffer = Buffer.from(parsed.data, 'utf8');
    const parsedBuffer = parsed.toBuffer();
    expect(buffer.equals(parsedBuffer)).equal(true);
  });
});

describe('validate', function () {
  it('should pass on valid data URLs', () => {
    const valid = [
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
    ];

    valid.forEach(value => {
      expect(validate(value), value).to.equal(true);
    });
  });

  it('should fail on invalid data URLs', () => {
    const invalid = [
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
    ];

    invalid.forEach(value => {
      expect(validate(value), value).to.equal(false);
    });
  });
});
