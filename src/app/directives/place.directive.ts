import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appPlace]',
  exportAs: 'place',
})
export class PlaceDirective {
  @Input() name: string;
  @Input() cab = false;
  selected = false;

  private top = '0px';
  private left = '0px';

  @HostListener('mouseenter') onMouseEnter() {
    this.top = '2px';
    this.left = '2px';
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.top = '0px';
    this.left = '0px';
  }

  @HostBinding('style.top') get getTop() {
    return this.top;
  }

  @HostBinding('style.left') get getLeft() {
    return this.left;
  }

  @HostListener('click') onClick() {
    this.selected = !this.selected;
    if (this.selected) {
      this.renderer.addClass(this.el.nativeElement, 'place-selected');
    } else {
      this.removeSelection();
    }
  }

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  removeSelection () {
    this.selected = false;
    this.renderer.removeClass(this.el.nativeElement, 'place-selected');
  }
}
