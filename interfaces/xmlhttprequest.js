declare module "xmlhttprequest" {
  declare class XMLHttpRequest {
    setRequestHeader(arg1: string, arg2: string): null;
    abort(): null;
    send(arg1: object): null;
    open(arg1: string, arg2: string, arg3: bool): null;
    onreadystatechange: Function;
    responseText: string;
    status: string;
  }

  declare var XMLHttpRequest:XMLHttpRequest;
}
