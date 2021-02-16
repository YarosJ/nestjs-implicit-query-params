<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[travis-image]: https://api.travis-ci.org/nestjs/nest.svg?branch=master
[travis-url]: https://travis-ci.org/nestjs/nest
[linux-image]: https://img.shields.io/travis/nestjs/nest/master.svg?label=linux
[linux-url]: https://travis-ci.org/nestjs/nest

## Description

PipeTransform for NestJS, which allows to implicitly or explicitly convert query param values types. An automatic types conversion is enabled by default, but for some cases, e.g. Boolean type, it not work, so to handle such cases can be used custom converters which usage given below.

## Usage of the custom converters

```typescript
import implicitQueryParams from 'nestjs-implicit-query-params';
```

There are 3 ways that can be used together or separately (for all 3 ways given examples of the conversion to the Boolean type):
1. Pass functions for the query param keys which receive String value and returns a new value with needed type:

```typescript
  @Get()
  getPosts(
    @Query(implicitQueryParams({
      personal: fieldValue => fieldValue === 'true',
    })) filterDto: GetPostsFilterDto,
  ): Promise<Posts[]> {
    return this.postsService.getPosts(filterDto);
  }
```

2. Pass objects where values can be mapped directly:

```typescript
  @Get()
  getPosts(
    @Query(implicitQueryParams({
      personal: {
        true: true,
        false: false,
      },
    })) filterDto: GetPostsFilterDto,
  ): Promise<Posts[]> {
    return this.postsService.getPosts(filterDto);
  }
```

3. Use custom query object converters that should handle and return the whole query object:

```typescript
  @Get()
  getPosts(
    @Query(implicitQueryParams(
      { <Explicit converters if needed> },
      [
        (queryObject): any => {
          if (typeof queryObject === 'object') {
            Object.keys(queryObject).forEach((key) => {
              const fieldValue: any = queryObject[key];

              if (fieldValue === 'true') {
                queryObject[key] = true;
              }

              if (fieldValue === 'false') {
                queryObject[key] = false;
              }
            });
          }

          return queryObject;
        },
      ],
    )) filterDto: GetPostsFilterDto,
  ): Promise<Posts[]> {
    return this.postsService.getPosts(filterDto);
  }
```

## License

MIT License. Copyright 2021 Yaroslav Zhuk

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
