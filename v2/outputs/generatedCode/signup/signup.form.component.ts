
    
    // Own file service ts
    service = inject();
    
    //  Data Var
    seqData: any[] = [];
    
    refNosignup: any;
    editRefNosignup: any;

    signupData: any[] = [];

    // String Var
    jbTittleSavesignup: any;
    jbTittleEditsignup: any;
    dbTittlesignup: any;

    // Boolean Var
    // Main page loading Progress Bar
    isMainPageLoading: boolean = true;
    
    // Save, Edit Data loading progress bar
    dataProcessLoadingsignup: boolean = false;

    // DialogBox
    dbVisiblesignup: boolean = false;


    // Display Info
    displayInfosignup: boolean = false;

    // Justify Box
    jbVisibleSavesignup: boolean = false;
    jbVisibleEditsignup: boolean = false;
    
    // Edit
    isEditablesignup: boolean = false;

    
    // Buttons
    isBtnDisabledsignup: boolean = false;
    
    // Roll Back
    isRollBacksignup: Boolean = true;

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
      this.signupRefno = await this.seqData[0].data;
      this.signupData = await this.seqData[1].data;
     
      } else {
        this.isLoading = true;
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
    }

    // Button Functions
    async applysignup(){
    
    }

    async savesignup(){
      this.jbOpenSavesignup()
    }

    async editsignup(){
      this.jbOpenEditsignup()
    }

    async rollBacksignup(){
    
    }

    async resetsignup(){
    
    }



    
    // Reset
    resetsignup(){
    
    }

    // Reload
    reloadsignup(){
    
    }

    // Submit Functions
    insertsignup(payload){
      await this.service.insertsignup(payLoad).subscribe({
      next: async (response: any) => {
        if (response.message == "success") {
          await this.messageService.add({ severity: 'success', summary: 'success', detail: 'None Created Successfully!', life: 8000 });
          await this.resetsignup();
          await this.reloadsignup();          
        }
      }
     });
    }

    updatesignup(id, payload){
      await this.service.updatesignup(payLoad).subscribe({
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
    dbOpensignup(){
      this.dbTittlesignup = "None"    
      this.dbVisiblesignup: boolean = true;
    }

    dbDismisssignup(){
      this.dbTittlesignup = null;
      this.dbVisiblesignup: boolean = false;
    }

    dbCloseEventsignup(){
      this.dbTittlesignup = null;
      this.dbVisiblesignup: boolean = false;
    }



    // Justify Box functions
    jbOpenSavesignup(){
      this.jbTittleSavesignup = "None"
      this.jbVisibleSavesignup: boolean = true;
    }

    jbOpenEditsignup(){
      this.jbTittleEditsignup = "None"
      this.jbVisibleEditsignup: boolean = true;
    }

    jbDismissSavesignup(){
      this.jbTittleSavesignup = null;
      this.jbVisibleSavesignup: boolean = false;
    }

       jbDismissEditsignup(){
      this.jbTittleEditsignup = null;
      this.jbVisibleEditsignup: boolean = false;
    }

    jbCloseEventSavesignup(){
      this.jbTittleSavesignup = null;
      this.jbVisibleSavesignup: boolean = false;
    
    }

    jbCloseEventEditsignup(){
      this.jbTittleEditsignup = null;
      this.jbVisibleEditsignup: boolean = false;
    
    }

    async jbInsertsignup(justify: any){
      const payLoad = {
        id: ,
        data: ,
        empData: empData,
        selDbData: selDbData,
        justify: justify,
        workFlowEnabled: this.workFlowEnabled
      }
      
      this.insertsignup(payload);
    }

    async jbUpdatesignup(justify: any){
      const payLoad = {
        uniqueId: ,
        dataId: ,
        data: ,
        empData: empData,
        selDbData: selDbData,
        justify: justify,
        workFlowEnabled: this.workFlowEnabled
      }
      this.updatesignup(payload);
    }


  





    