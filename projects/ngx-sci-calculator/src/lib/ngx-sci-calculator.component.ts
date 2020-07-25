import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';

import { E_SERIES, opCodes, slideToggle } from './sci-calc.const';

@Component({
  selector: 'lib-ngx-sci-calculator',
  templateUrl: './ngx-sci-calculator.component.html',
  styleUrls: ['./ngx-sci-calculator.component.scss']
})

// const domElem = require('./calc.wrapper.html');

export class NgxSciCalculatorComponent implements OnInit {

  @ViewChild('stackRegister') stackRegister: ElementRef;
  @ViewChild('voltExtPanel') voltExtPanel: ElementRef;
  @Input() open: boolean;
  @Input() draggable: boolean;
  @Input() fixedLayout: boolean;
  @Output() onClose = new EventEmitter();

  showStack = false;
  showCalc = false;
  isExtPanelVisible = false;

  constructor() { }

  // BINARY OPERATION CODES ****************************************************
  // nop      :0
  // add      :1
  // subtract :2
  // mult     :3
  // div      :4
  // y^x      :5
  // %        :6
  // RR       :10
  // FLC      :11

  strEmpty = '';

  // input string length limit
  maxLength = 14;
  // operation code
  opCode = 0;
  // stack memory register
  stackVal = 0;
  // flag to clear input box on data pre-entry
  boolClear = true;
  // calculator state: normal or expanded
  oscExtState = false;

  closeCalc() {
    this.onClose.emit(event);
  }

  onStackMouseOver(event: Event) {
    const op = opCodes[this.opCode] || '';
    this.showStack = true;
    this.stackRegister.nativeElement.innerHTML = this.stackVal + op;
  }

  onStackMouseOut(event: Event) {
    this.showStack = false;
  }

  onExtControlClick() {
    slideToggle(this.voltExtPanel.nativeElement);
    this.isExtPanelVisible = !this.isExtPanelVisible;
  }

  ngOnInit() {
  }

  //Numeric key click handler
  clickNumeric(e) {
    const btnVal = e.target.textContent;
    // MOD 03/16
    const inBox = document.getElementById('keyPad_UserInput') as HTMLInputElement;

    // clear input box if flag set
    if (this.boolClear) { inBox.value = this.strEmpty; this.boolClear = false; }
    const str = inBox.value;

    // limit the input length
    if (str.length > this.maxLength) return;

    // prevent duplicate dot entry
    if (e.target.id == "keyPad_btnDot" && str.indexOf('.') >= 0) return;

    // clear input box if not a valid content
    if (!this.IsValidString(inBox.value)) {
      inBox.value = this.strEmpty;
    }

    inBox.value = str + btnVal;
    inBox.focus();
  }

  // *********************************************************
  // COMMAND BUTTONS: BACKSPACE, CLEAR AND ALL CLEAR
  clickBtnCommand(e) {
    const inBox = document.getElementById('keyPad_UserInput') as HTMLInputElement;
    const mem = document.getElementById('keyPad_Mem') as HTMLInputElement;
    const strInput = inBox.value;

    switch (e.target.id) {
      // on ENTER (=) calculate the result, clear opCode                                                           
      case 'keyPad_btnEnter':
        this.oscBinaryOperation(); this.opCode = 0; break;
      // clear input box (if not empty) or this.opCode            
      case 'keyPad_btnClr':
        if (strInput == this.strEmpty) { this.opCode = 0; this.boolClear = false; }
        else { inBox.value = this.strEmpty }
        break;
      // clear the last char if input box is not empty                                                                   
      case 'keyPad_btnBack': if (strInput.length > 0) {
        inBox.value = (strInput.substring(0, strInput.length - 1)); break;
      }
      // clear all          
      case 'keyPad_btnAllClr':
        inBox.value = this.strEmpty;
        this.stackVal = 0;
        mem.value = this.strEmpty;
        this.opCode = 0;
        break;
      default: break;
    }
  };

  // BINARY COMPUTATION *********
  oscBinaryOperation() {
    var inBox = document.getElementById('keyPad_UserInput') as HTMLInputElement;

    // parse input
    var x2 = parseFloat(inBox.value);

    switch (this.opCode) {
      case 1: this.stackVal += x2; break;
      case 2: this.stackVal -= x2; break;
      case 3: this.stackVal *= x2; break;
      case 4: this.stackVal /= x2; break;
      // stack power inputBox                                                        
      case 5: this.stackVal = Math.pow(this.stackVal, x2); break;
      //RR   
      case 10: this.stackVal = (this.stackVal * x2) / (this.stackVal + x2); break;
      //FLC   
      case 11: this.stackVal = 1 / (2 * Math.PI * Math.sqrt(this.stackVal * x2)); break;
      default: break;
    }

    this.boolClear = true;
    inBox.value = String(this.stackVal);
    inBox.focus();
  }

  // MEMORY OPERATIONS **************************************
  clickBtnMemOp(e) {
    const inBox = document.getElementById('keyPad_UserInput') as HTMLInputElement;
    const mem = document.getElementById('keyPad_Mem') as HTMLInputElement;
    let dInbox = 0;
    let dMem = 0;

    // move input value to mem
    if (e.target.id == 'keyPad_btnToMem') {
      // input box validation: must be not empty & Finite & not NaN
      if (this.IsEmpty(inBox.value)) { return; }
      if (!this.IsValidString(inBox.value)) { inBox.value = this.strEmpty; return; }
      mem.value = inBox.value;
      this.boolClear = true;
    }

    // move mem value to input box
    if (e.target.id == 'keyPad_btnFromMem') { inBox.value = mem.value; return; }

    // validate and parse input box
    if (this.IsEmpty(inBox.value)) { return; }
    if (!this.IsValidString(inBox.value)) { inBox.value = this.strEmpty; return; }
    dInbox = parseFloat(inBox.value);

    // validate and parse memory box: convert to zero if not valid
    if (this.IsEmpty(mem.value)) { mem.value = String(0); }
    if (!this.IsValidString(mem.value)) { mem.value = String(0); }
    dMem = parseFloat(mem.value);

    // *** perform arithmetic operations w/memory
    switch (e.target.id) {
      // add to mem                                               
      case 'keyPad_btnMemPlus': mem.value = String(dMem + dInbox); break;
      // subtract from mem                                                
      case 'keyPad_btnMemMinus': mem.value = String(dMem - dInbox); break;
      default: break;
    }
    this.boolClear = true;
  };

  // CLEAR MEM BOX BY CLICKING ON IT
  clickTextBox(e) {
    const mem = document.getElementById('keyPad_Mem') as HTMLInputElement;
    switch (e.target.id) {
      case 'keyPad_Mem': mem.value = this.strEmpty; break;
      default: break;
    }
  };

  // UNARY OPERATIONS *****************************
  clickBtnUnaryOp(e) {
    const oscInBox = document.getElementById('keyPad_UserInput') as HTMLInputElement;
    let x;
    let retVal = 0;

    // validate input box
    if (!this.IsValidString(oscInBox.value)) { oscInBox.value = this.strEmpty; return; }
    if (this.IsEmpty(oscInBox.value)) { return; }

    // get input value
    x = parseFloat(oscInBox.value);

    switch (e.target.id) {
      // +/-                                                                           
      case 'keyPad_btnInverseSign': retVal = -x; break;
      // 1/X                                                                           
      case 'keyPad_btnInverse': retVal = 1 / x; break;
      // X^2                                                                           
      case 'keyPad_btnSquare': retVal = x * x; break;
      // SQRT(X)                                                                           
      case 'keyPad_btnSquareRoot': retVal = Math.sqrt(x); break;
      // X^3                                                                           
      case 'keyPad_btnCube': retVal = x * x * x; break;
      // POW (X, 1/3)                                                                           
      case 'keyPad_btnCubeRoot': retVal = Math.pow(x, 1 / 3); break;
      // NATURAL LOG                                                                           
      case 'keyPad_btnLn': retVal = Math.log(x); break;
      // LOG BASE 10                                                                           
      case 'keyPad_btnLg': retVal = Math.log(x) / Math.LN10; break;
      // E^(X)                                                                           
      case 'keyPad_btnExp': retVal = Math.exp(x); break;
      // SIN                                                                           
      case 'keyPad_btnSin': retVal = Math.sin(x); break;
      // COS                                                                           
      case 'keyPad_btnCosin': retVal = Math.cos(x); break;
      // TAN                                                                           
      case 'keyPad_btnTg': retVal = Math.tan(x); break;
      // CTG                                                                           
      case 'keyPad_btnCtg': retVal = 1 / Math.tan(x); break;

      // Arcsin                                                                          
      case 'keyPad_btnAsin': retVal = Math.asin(x); break;
      // Arccos                                                                          
      case 'keyPad_btnAcos': retVal = Math.acos(x); break;
      // Arctag                                                                          
      case 'keyPad_btnAtan': retVal = Math.atan(x); break;

      // Secant                                                                          
      case 'keyPad_btnSec': retVal = 1 / Math.cos(x); break;
      // Cosecant                                                                          
      case 'keyPad_btnCosec': retVal = 1 / Math.sin(x); break;

      // sinh                                                                            
      case 'keyPad_btnSinH':
        retVal = (Math.pow(Math.E, x) - Math.pow(Math.E, -x)) / 2; break;
      // cosh                                                                            
      case 'keyPad_btnCosinH':
        retVal = (Math.pow(Math.E, x) + Math.pow(Math.E, -x)) / 2; break;
      // coth                                                                            
      case 'keyPad_btnTgH':
        retVal = (Math.pow(Math.E, x) - Math.pow(Math.E, -x));
        retVal /= (Math.pow(Math.E, x) + Math.pow(Math.E, -x));
        break;
      // Secant hyperbolic                                                                           
      case 'keyPad_btnSecH':
        retVal = 2 / (Math.pow(Math.E, x) + Math.pow(Math.E, -x)); break;
      // Cosecant hyperbolic                                                                           
      case 'keyPad_btnCosecH':
        retVal = 2 / (Math.pow(Math.E, x) - Math.pow(Math.E, -x));; break;
      // 1+x                                                                          
      case 'keyPad_btnOnePlusX': retVal = 1 + x; break;
      // 1-x                                                                          
      case 'keyPad_btnOneMinusX': retVal = 1 - x; break;

      // ELECTRICAL ENGINEERING ************************************   
      // Zc (60 Hz)                                                                         
      case 'keyPad_btnZC': retVal = 1 / (120 * Math.PI * x); break;
      // ZL (60Hz)                                                                         
      case 'keyPad_btnZL': retVal = 120 * Math.PI * x; break;
      // Zc (50 Hz)                                                                          
      case 'keyPad_btnZC50': retVal = 1 / (100 * Math.PI * x); break;
      // ZL (50Hz)                                                                          
      case 'keyPad_btnZL50': retVal = 100 * Math.PI * x; break;
      // F->w                                                                            
      case 'keyPad_btnF2W': retVal = 2 * Math.PI * x; break;
      // w->F                                                                           
      case 'keyPad_btnW2F': retVal = x / (2 * Math.PI); break;

      default: break;
    }
    this.boolClear = true;

    oscInBox.value = String(retVal);
    oscInBox.focus();
  };

  // PREFIX OPERATIONS ***************************
  clickBtnPrefix(e) {
    const oscInBox = document.getElementById('keyPad_UserInput') as HTMLInputElement;
    let x;
    let retVal;

    // validate input box
    if (!this.IsValidString(oscInBox.value)) { oscInBox.value = this.strEmpty; return; }
    if (this.IsEmpty(oscInBox.value)) { return; }

    // get input value
    x = parseFloat(oscInBox.value);

    switch (e.target.id) {
      // =*1000   
      case 'keyPad_btnKilo': x *= 1000; break;
      // =*1000000   
      case 'keyPad_btnMega': x *= 1000000; break;
      // =*1000,000,000   
      case 'keyPad_btnGiga': x *= 1000000000; break;
      // =/1000    
      case 'keyPad_btnMilli': x /= 1000; break;
      // =/1000000    
      case 'keyPad_btnMicro': x /= 1000000; break;
      // =/1000,000,000    
      case 'keyPad_btnNano': x /= 1000000000; break;
      default: break;
    }
    oscInBox.value = x;
    oscInBox.focus();
  };

  // BINARY OPERATION KEY *************************************
  clickBtnBinaryOp(e) {
    const inBox = document.getElementById('keyPad_UserInput') as HTMLInputElement;
    let newOpCode = 0;

    // validate input box
    if (!this.IsValidString(inBox.value)) { inBox.value = this.strEmpty; return; }
    if (this.IsEmpty(inBox.value) && this.IsEmpty(this.stackVal)) { return; }

    switch (e.target.id) {
      case 'keyPad_btnPlus': newOpCode = 1; break;
      case 'keyPad_btnMinus': newOpCode = 2; break;
      case 'keyPad_btnMult': newOpCode = 3; break;
      case 'keyPad_btnDiv': newOpCode = 4; break;
      case 'keyPad_btnYpowX': newOpCode = 5; break;
      case 'keyPad_btnPercent':
        if (this.opCode == 1 || this.opCode == 2) { inBox.value = String(this.stackVal * parseFloat(inBox.value) / 100); }
        else if (this.opCode == 3 || this.opCode == 4) { inBox.value = String(parseFloat(inBox.value) / 100); }
        else return;
        break;
      case 'keyPad_btnRR': newOpCode = 10; break;
      case 'keyPad_btnFLC': newOpCode = 11; break;
      default: break;
    }
    if (this.opCode) { this.oscBinaryOperation(); }
    else { this.stackVal = parseFloat(inBox.value); this.boolClear = true; }
    this.opCode = newOpCode;
    inBox.focus();
  };

  // CONST KEY DATA ENTRY ***********************
  clickBtnConst(e) {
    let retVal = 0;
    let inBox = document.getElementById('keyPad_UserInput') as HTMLInputElement;

    switch (e.target.id) {
      // PI                                                                              
      case 'keyPad_btnPi': retVal = Math.PI; break;
      // PI/2                                                                              
      case 'keyPad_btnPiDiv2': retVal = Math.PI / 2; break;
      // PI/3                                                                              
      case 'keyPad_btnPiDiv3': retVal = Math.PI / 3; break;
      // PI/4                                                                              
      case 'keyPad_btnPiDiv4': retVal = Math.PI / 4; break;
      // PI/6                                                                              
      case 'keyPad_btnPiDiv6': retVal = Math.PI / 6; break;
      // e                                                                              
      case 'keyPad_btnE': retVal = Math.E; break;
      // 1/e                                                                              
      case 'keyPad_btnInvE': retVal = 1 / Math.E; break;
      // SQRT(2)                                                                              
      case 'keyPad_btnSqrt2': retVal = Math.SQRT2; break;
      // SQRT(3)                                                                              
      case 'keyPad_btnSqrt3': retVal = Math.sqrt(3); break;
      // CUBE ROOT OF(3)                                                                              
      case 'keyPad_btnCubeRoot2': retVal = Math.pow(2, 1 / 3); break;
      // Ln(10)                                                                              
      case 'keyPad_btnLn10': retVal = Math.LN10; break;
      // base10: Log(e)                                                                              
      case 'keyPad_btnLgE': retVal = Math.LOG10E; break;
      // Sigmas: defects probability: on scale 0...1                                                                               
      // 1 Sigma                                                                              
      case 'keyPad_btnSigma': retVal = 0.69; break;
      // 3 Sigma                                                                               
      case 'keyPad_btnSigma3': retVal = 0.007; break;
      // 6 Sigma                                                                               
      case 'keyPad_btnSigma6': retVal = 3.4 * Math.pow(10, -6); break;
      default: break;
    }
    this.boolClear = true;
    inBox.focus();
    inBox.value = String(retVal);
  };

  // Clear E-Series Table
  // ClearTableE(tabOut) { tabOut.empty(); _seriesOpened.length = 0; }

  // ** AUX FUNCTIONS **
  // validate that isFinite and not NaN
  IsValidString(str) {
    if ((!isNaN(str)) && (isFinite(str))) { return (true); } return (false);
  }
  // string empty test
  IsEmpty(str) { if (str.length > 0) { return (false); } return true; }

  // validate and format stack
  IsStackValid() {
    if (!isNaN(this.stackVal) && isFinite(this.stackVal)) { return (true); } return (false);
  }
}
