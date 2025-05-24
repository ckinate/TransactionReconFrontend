import { PermissionAnyPipe } from './permission-any.pipe';

describe('PermissionAnyPipe', () => {
  it('create an instance', () => {
    const pipe = new PermissionAnyPipe();
    expect(pipe).toBeTruthy();
  });
});
