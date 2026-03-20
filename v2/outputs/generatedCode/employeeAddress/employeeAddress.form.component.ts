
    
    // Own file service ts
    service = inject();
    
    //  Data Var
    seqData: any[] = [];
    
    refNoemployeeAddress: any;
    editRefNoemployeeAddress: any;

    employeeAddressData: any[] = [];

    // String Var
    jbTittleSaveemployeeAddress: any;
    jbTittleEditemployeeAddress: any;
    dbTittleemployeeAddress: any;

    // Boolean Var
    // Main page loading Progress Bar
    isMainPageLoading: boolean = true;
    
    // Save, Edit Data loading progress bar
    dataProcessLoadingemployeeAddress: boolean = false;

    // DialogBox
    dbVisibleemployeeAddress: boolean = false;


    // Display Info
    displayInfoemployeeAddress: boolean = false;

    // Justify Box
    jbVisibleSaveemployeeAddress: boolean = false;
    jbVisibleEditemployeeAddress: boolean = false;
    
    // Edit
    isEditableemployeeAddress: boolean = false;

    
    // Buttons
    isBtnDisabledemployeeAddress: boolean = false;
    
    // Roll Back
    isRollBackemployeeAddress: Boolean = true;

    // WorkFlow
    workFlowEnabled: boolean = false;
    selectedStage: any;

    ngOnInit(): void {  
       this.startUp();
    }

    ngAfterViewInit(): void {
      
    }
    
    async startUp() {
    try {
      // Fetch the data sequentially
      this.seqData = await this.service.seqRun();
      // Load Data
      this.employeeAddressRefno = await this.seqData[0].data;
      this.employeeAddressData = await this.seqData[1].data;
     
      } else {
        this.isLoading = true;
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
    }

    // Button Functions
    async applyemployeeAddress(){
    
    }

    async saveemployeeAddress(){
      this.jbOpenSaveemployeeAddress()
    }

    async editemployeeAddress(){
      this.jbOpenEditemployeeAddress()
    }

    async rollBackemployeeAddress(){
    
    }

    async resetemployeeAddress(){
    
    }



    
    // Reset
    resetemployeeAddress(){
    
    }

    // Reload
    reloademployeeAddress(){
    
    }

    // Submit Functions
    insertemployeeAddress(payload){
      await this.service.insertemployeeAddress(payLoad).subscribe({
      next: async (response: any) => {
        if (response.message == "success") {
          await this.messageService.add({ severity: 'success', summary: 'success', detail: 'None Created Successfully!', life: 8000 });
          await this.resetemployeeAddress();
          await this.reloademployeeAddress();          
        }
      }
     });
    }

    updateemployeeAddress(id, payload){
      await this.service.updateemployeeAddress(payLoad).subscribe({
      next: async (response: any) => {
        if (response.message == "success") {
          await this.messageService.add({ severity: 'success', summary: 'success', detail: 'None Updated Successfully!', life: 8000 });
          await this.resetAddress();
          await this.reload();         
        }
      }
    });
    }

    // Dialog Box funtions
    dbOpenemployeeAddress(){
      this.dbTittleemployeeAddress = "None"    
      this.dbVisibleemployeeAddress: boolean = true;
    }

    dbDismissemployeeAddress(){
      this.dbTittleemployeeAddress = null;
      this.dbVisibleemployeeAddress: boolean = false;
    }

    dbCloseEventemployeeAddress(){
      this.dbTittleemployeeAddress = null;
      this.dbVisibleemployeeAddress: boolean = false;
    }



    // Justify Box functions
    jbOpenSaveemployeeAddress(){
      this.jbTittleSaveemployeeAddress = "None"
      this.jbVisibleSaveemployeeAddress: boolean = true;
    }

    jbOpenEditemployeeAddress(){
      this.jbTittleEditemployeeAddress = "None"
      this.jbVisibleEditemployeeAddress: boolean = true;
    }

    jbDismissSaveemployeeAddress(){
      this.jbTittleSaveemployeeAddress = null;
      this.jbVisibleSaveemployeeAddress: boolean = false;
    }

       jbDismissEditemployeeAddress(){
      this.jbTittleEditemployeeAddress = null;
      this.jbVisibleEditemployeeAddress: boolean = false;
    }

    jbCloseEventSaveemployeeAddress(){
      this.jbTittleSaveemployeeAddress = null;
      this.jbVisibleSaveemployeeAddress: boolean = false;
    
    }

    jbCloseEventEditemployeeAddress(){
      this.jbTittleEditemployeeAddress = null;
      this.jbVisibleEditemployeeAddress: boolean = false;
    
    }

    async jbInsertemployeeAddress(justify: any){
      const payLoad = {
        id: ,
        data: ,
        empData: empData,
        selDbData: selDbData,
        justify: justify,
        workFlowEnabled: this.workFlowEnabled
      }
      
      this.insertemployeeAddress(payload);
    }

    async jbUpdateemployeeAddress(justify: any){
      const payLoad = {
        uniqueId: ,
        dataId: ,
        data: ,
        empData: empData,
        selDbData: selDbData,
        justify: justify,
        workFlowEnabled: this.workFlowEnabled
      }
      this.updateemployeeAddress(payload);
    }


  





    